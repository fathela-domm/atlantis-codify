import React from 'react';
import { IonModal, IonContent, IonButton, IonToolbar, IonTitle, useIonToast, IonHeader, IonButtons, IonSpinner } from "@ionic/react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { update } from "../../services/firebase/database.module";

interface Data {
    username: string;
    email: string
}

interface UpdateJobModalComponentProps {
    setShowCreateModal: Function;
    showCreateModal: boolean;
    user: any;
    setCurrentUser: Function;
}

export default function UpdateJobModalComponent(props: UpdateJobModalComponentProps) {
    const { user, showCreateModal, setShowCreateModal, setCurrentUser } = props;
    const [isLoading, setIsLoading] = React.useState(false);
    const [username, setUsername] = React.useState<string>(user.displayName);
    const [email, setEmail] = React.useState<string>(user.email);
    const [present, dismiss] = useIonToast();

    const showToast = (msg: string) => {
        return present({
            message: msg,
            duration: 3000,
            onDidDismiss: () => dismiss(),
        });
    };
    const updateCurrentUser = (e: any) => {
        setIsLoading(true);
        update("/users/" + user.id, {
            displayName: username,
            email: email
        })
            .then((res: any) => {
                setIsLoading(false);
                setShowCreateModal(false);
                showToast("Profile successfully updated");
                setCurrentUser({ ...user, displayName: username, email: email })
            })
            .catch((err: any) => {
                console.error(err);
                showToast("Profile not successfully updated.Please check the integrity of your network.");
            });
    }
    return (
        <>
            <IonModal
                isOpen={showCreateModal}
                swipeToClose={true}
                cssClass="custom-ion-modal"
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle >Update Profile</IonTitle>
                        <IonButtons slot="end">
                            <IonButton color="danger" onClick={() => setShowCreateModal(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <ValidatorForm
                        onSubmit={updateCurrentUser}
                        onError={errors => console.log(errors)}
                        style={{
                            width: "90%",
                            margin: 'auto',
                        }}
                    >
                        <TextValidator
                            className="mt-4 mb-3 col-sm-12"
                            label="Username*"
                            fullWidth
                            onChange={(e: any) => setUsername(e.target.value)}
                            name="username"
                            value={username}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <TextValidator
                            className="mt-2 mb-2 col-sm-12"
                            label="Email"
                            onChange={(e: any) => setEmail(e.target.value)}
                            name="email*"
                            value={email}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            fullWidth
                        />
                        <IonButton disabled={isLoading} className="ion-margin-top" type="submit" expand="block">
                            {
                                !isLoading ? <>Update</> : <IonSpinner></IonSpinner>
                            }
                        </IonButton>
                    </ValidatorForm>
                </IonContent>
            </IonModal>

        </>
    );
}