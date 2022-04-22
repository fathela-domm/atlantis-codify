import React from 'react';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { useIonToast, useIonActionSheet, useIonAlert } from "@ionic/react";
import { close, notificationsCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom"
import { update, get } from "../services/firebase/database.module";
import capacitorStorageService from "../services/storage/capacitor-storage.module";
import { GetResult } from '@capacitor/storage';
import { Capacitor } from "@capacitor/core";

export default function usePushNotificationsService() {
    const [registrationToken, setRegistrationToken] = React.useState<any>('');
    const nullEntry: any[] = []
    const [notifications, setnotifications] = React.useState(nullEntry);
    const [present, dismiss] = useIonToast();
    const [presentActionSheet, dismissActionSheet] = useIonActionSheet();
    const [presentIonicAlert, dismissIonicAlert] = useIonAlert();
    const history = useHistory();

    const showIonicAlert = (msg: string) => {
        return presentIonicAlert({
            message: msg,
            buttons: [
                {
                    text: 'Dismiss',
                    role: 'cancel',
                    handler: () => {
                        dismissIonicAlert();
                    }
                }
            ],
        });
    }

    const showPermissionsActionSheet = () => {
        return presentActionSheet({
            header: 'Allow us to send you notifications',
            buttons: [
                {
                    text: 'Allow',
                    icon: notificationsCircle,
                    handler: () => {
                        register();
                    }
                },
                {
                    text: 'Dismiss',
                    icon: close,
                    role: 'cancel',
                    handler: () => {
                        dismissActionSheet();
                    }
                }
            ],
        });
    }

    const showToast = (msg: string) => {
        return present({
            buttons: [{ text: 'hide', handler: () => dismiss() }],
            message: msg,
            duration: 3000,
            onDidDismiss: () => console.log('dismissed'),
            onWillDismiss: () => console.log('will dismiss'),
        });
    };

    React.useLayoutEffect(() => {
        if (Capacitor.getPlatform() !== 'web') {
            register();
        }
    }, [])

    const register = () => {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token: Token) => {
                let data: any;
                capacitorStorageService.get('user')
                    .then((res: GetResult) => {
                        if (res && res.value) {
                            const userObject = JSON.parse(res.value);
                            get("/users")
                                .then((snapshot: any) => {
                                    for (let id in snapshot.val()) {
                                        Object.keys(snapshot.val()[id])
                                            .map(key => {
                                                // too acommodate those who signed in with both phone and email
                                                if (snapshot.val()[id][key]["email"] == userObject["email"] || snapshot.val()[id][key]["phoneNo"] == userObject["phoneNo"])
                                                    data = { id: key };
                                            });
                                    }

                                })
                                .then((res: any) => {
                                    if (data && data.id) {
                                        update("/users/" + data.id, { registrationToken: token.value });
                                    }
                                })
                                .catch((err: any) => console.error(err));

                        }
                    })
                setRegistrationToken(token.value);
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error: any) => {
                console.error(JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotificationSchema) => {
                setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            async (notification: ActionPerformed) => {
                setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
                let data = notification.notification.data;
                showIonicAlert(JSON.stringify(data));
                if (data.jobId) {
                    history.push("/admin/jobs/" + data.jobId);
                }
            }
        );
    }

    const removeAllDeliveredNotifications = () => {
        PushNotifications.removeAllDeliveredNotifications();
    }

    return {
        notifications: notifications,
        registrationToken: registrationToken,
        removeAllDeliveredNotifications: removeAllDeliveredNotifications,
    }
}