import React from 'react';
import "./singlejob.component.css";
import { useParams, useHistory } from 'react-router';
import { get, databaseRef, remove, update } from "../../services/firebase/database.module";
import { IonItem, IonItemDivider, IonList, IonSpinner } from "@ionic/react";
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import capacitorStorageService from "../../services/storage/capacitor-storage.module";
import CardFooter from '../../components/Card/CardFooter'
import useIsMounted from "../../hooks/ismounted-hook.module";
import { createStyles } from '@material-ui/core';
import ChatWidget from "./chat.widget";
import UpdateJobModal from "./update-job-modal.component";
import { useIonActionSheet, useIonToast, useIonAlert } from "@ionic/react";
import { close, syncCircle, watch, warning, ellipsisHorizontalCircleSharp } from 'ionicons/icons';
import { post } from "../../services/internet-services/http-service.module";
import { checkPriviledges } from "../../auth/authorize-user.module";

export interface QueryParameterInterface {
    idQueryParam: string;
}

const styles = createStyles({
    cardCategoryWhite: {
        color: 'rgba(255,255,255,.62)',
        margin: '0',
        fontSize: '14px',
        marginTop: '0',
        marginBottom: '0'
    },
    cardTitleWhite: {
        color: '#FFFFFF',
        marginTop: '0px',
        minHeight: 'auto',
        fontWeight: 300,
        fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
        marginBottom: '3px',
        textDecoration: 'none'
    },
    backButtonWrapper: {
        color: "red",
        zoom: 10,
        position: 'static',
        zIndex: 100,
    },
    contentHeader: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "20px",
        marginBottom: "-10px",
        left: "20px"
    },
    contentBody: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "15px",
        left: "20px",
        marginBottom: "-20px",
    }
});

interface SingleJobsPageProps {
    classes: any;
}

function SingleJobsPage(props: SingleJobsPageProps) {
    const { idQueryParam } = useParams<QueryParameterInterface>();
    const [singleJobData, setSingleJobData] = React.useState<any>([]);
    const [isLoadingJobsData, setIsLoadingJobsData] = React.useState(true);
    const [user, setUser] = React.useState<any>(null);
    const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);
    const { classes } = props;
    const isMounted = useIsMounted();
    const history = useHistory();
    const [present, dismiss] = useIonActionSheet();
    const [presentIonicAlert, dismissIonicAlert] = useIonAlert();
    const [presentIonicToast, dismissIonicToast] = useIonToast();

    const showIonAlert = (msg: string) => {
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
    };

    const showToast = (msg: string) => {
        return presentIonicToast({
            message: msg,
            duration: 3000,
            onDidDismiss: () => dismiss(),
        });
    };

    const concludeTheJob = () => {
        // notify client that job has been concluded and request for their reviews.
        capacitorStorageService.get("user")
            .then((res: any) => {
                if (res.value) {
                    update("/jobs/" + idQueryParam, { archieved: true, concludedOn: new Date().toISOString(), concludedBy: { "username": JSON.parse(res.value).displayName, "email": JSON.parse(res.value).email } })
                        .then((res: any) => {
                            showToast("Job successfully concluded and moved to archive")
                            post("/sendSMS", {
                                receiver: `+${singleJobData[0].clientPhoneNo}`,
                                message: `We are glad to conclude Job <<${singleJobData[0].job}>>.\nWorking for you has been a wonderful experience and we hope that the feeling is mutual.\nIf you have any complaints or would like to send us your reviews, please do so as soon as you can.\nRegards `,
                            })
                                .then((res: any) => {
                                    showToast("SMS successfully sent to the client.");
                                })
                                .then((res: any) => {
                                    let registrationTokens: any = [];
                                    get('/')
                                        .then((snapshot: any) => {
                                            for (let id in snapshot.val()) {
                                                if (id == "users") {
                                                    Object.keys(snapshot.val()[id])
                                                        .map((key: string) => {
                                                            if (snapshot.val()[id][key]['registrationToken'] && String(snapshot.val()[id][key]['registrationToken']).length > 0)
                                                                registrationTokens.push(snapshot.val()[id][key]['registrationToken'])
                                                        })
                                                }
                                            }
                                        })
                                        .then((snapshot: any) => {
                                            if (registrationTokens.length > 0) {
                                                // send notifications to all registered users
                                                post("/cloudMessaging/sendCloudMessage", {
                                                    registrationTokens: registrationTokens,
                                                    message: {
                                                        title: "Job Conclusion",
                                                        body: "Job " + singleJobData[0]?.job + " has been concluded and moved to Archive."
                                                    },
                                                    jobId: singleJobData[0]?.id
                                                })
                                                    .then((res: any) => {
                                                        showToast('Client successfully notified via SMS')
                                                    })
                                                    .catch((err: any) => {
                                                        showIonAlert("Job successfully concluded and moved to archive but target employees may not have been notified. Please consider informing them manually and check the integrity of your network")
                                                        console.error(err)
                                                    })
                                            }
                                        })
                                        .catch((err: any) => {
                                            showIonAlert("Job successfully concluded and moved to archive but target employees may not have been notified. Please consider informing them manually and check the integrity of your network")
                                            console.error(err)
                                        })
                                })
                                .catch((err: any) => {
                                    showIonAlert("Job successfully concluded and moved to archive but client may not have been notified. Please consider informing them manually and check the integrity of your network")
                                    console.error(err)
                                })
                        })
                        .then(async (res: any) => {
                            // send client paid invoice email
                            showToast("Generating email to send to " + singleJobData[0].clientEmail + ".");
                            return post("/sendPaymentReceivedMail", {
                                invoiceData: singleJobData[0].invoiceData,
                                receiver: singleJobData[0].clientEmail
                            })
                                .then((res: any) => {
                                    showToast("Payment Received mail successfully sent to email " + singleJobData[0].clientEmail + ".");
                                    update("/jobs/" + singleJobData[0]?.id, {
                                        sentInvoices: [
                                            ...singleJobData[0]?.sentInvoices,
                                            {
                                                type: "payment received",
                                                dateSent: new Date().toISOString(),
                                            }
                                        ]
                                    })
                                })
                                .catch((err: any) => showToast("An error has occured during the operation. Please try again later. \nIf error persists, please contact the developer."))

                        })
                        .catch((err: any) => {
                            showToast(":( Job may not have been concluded and moved to archived. Please check the integrity of your network.")
                        });
                }
            })
    }

    const sendClientAReminder = () => {
        showToast("Generating email to send to the client");
        post('/sendReminderMail', {
            invoiceData: singleJobData[0].invoiceData,
            receiver: singleJobData[0].clientEmail
        })
            .then((res: any) => {
                showToast("Email successfully sent to client " + singleJobData[0]?.clientEmail);
                // send sms to client that an email has been received
                post('/sendSMS', {
                    message: `Good day. We have sent an email to your inbox at ${singleJobData[0]?.clientEmail}.\nThe email contains an invoice for job ${singleJobData[0].job} which is due on ${new Date(singleJobData[0]?.invoiceData.invoiceDueDate).toDateString()}.\nWe are sure you're busy, but would appreciate it if you took some time to look over the email.\nIf you didn't receive an email, check your spam folder or contact us right away.\nRegards `,
                    receiver: `+${singleJobData[0]?.clientPhoneNo}`
                })
                    .then((res: any) => {
                        showToast("The client has received the email and has been notified via SMS");
                    })
                    .catch((err: any) => {
                        showToast("Email received but SMS not successfully sent. Please check the integrity of your network");
                        console.error(err)
                    });

                update("/jobs/" + singleJobData[0]?.id, {
                    sentInvoices: [
                        ...singleJobData[0]?.sentInvoices,
                        {
                            type: "reminder invoice",
                            dateSent: new Date().toISOString(),
                        }
                    ]
                })
            })
            .catch((err: any) => {
                showToast("Email may not have been received. Please check the integrity of your network");
                console.error(err)
            });
    }
    function checkUserPriviledge() {
        capacitorStorageService.create("developer", "domm mbugua").then((res: any) => {
            capacitorStorageService.get('user')
                .then((res: any) => {
                    if (res && res.value) {
                        const user = JSON.parse(res.value);
                        setUser(user)
                        checkPriviledges(user);
                    }
                })
                .catch((err: any) => console.error(err));
        })
    }

    // check user priviledges
    React.useLayoutEffect(() => {
        databaseRef.on("child_added", (snapshot: any) => {
            checkUserPriviledge();
        });

        databaseRef.on("child_changed", (snapshot: any) => {
            checkUserPriviledge();
        });

        databaseRef.on("child_removed", (snapshot: any) => {
            checkUserPriviledge();
        });
        databaseRef.on("child_moved", (snapshot: any) => {
            checkUserPriviledge();
        });
    }, []);

    const sendEarlyOverdueReminder = () => {
        showToast("Generating early overdue email to send to " + singleJobData[0].clientEmail + ".");
        return post("/sendEarlyOverdueMail", {
            invoiceData: singleJobData[0].invoiceData,
            receiver: singleJobData[0].clientEmail
        })
            .then((res: any) => {
                showToast("Email successfully sent to email " + singleJobData[0].clientEmail + ".");
                update("/jobs/" + singleJobData[0]?.id, {
                    sentInvoices: [
                        ...singleJobData[0]?.sentInvoices,
                        {
                            type: "early overdue invoice",
                            dateSent: new Date().toISOString(),
                        }
                    ]
                })
            })
            .catch((err: any) => showToast("An error has occured during the operation. Please try again later. \nIf error persists, please contact the developer."))
    }

    const sendLateOverdueReminder = () => {
        showToast("Generating late overdue email to send to " + singleJobData[0].clientEmail + ".");
        return post("/sendLateOverdueMail", {
            invoiceData: singleJobData[0].invoiceData,
            receiver: singleJobData[0].clientEmail
        })
            .then((res: any) => {
                showToast("Email successfully sent to email " + singleJobData[0].clientEmail + ".");
                update("/jobs/" + singleJobData[0]?.id, {
                    sentInvoices: [
                        ...singleJobData[0]?.sentInvoices,
                        {
                            type: "late overdue invoice",
                            dateSent: new Date().toISOString(),
                        }
                    ]
                })
            })
            .catch((err: any) => showToast("An error has occured during the operation. Please try again later. \nIf error persists, please contact the developer."))
    }

    const presentIonActionSheet = () => {
        return present({
            header: 'More Actions',
            buttons: [
                {
                    text: 'Send a reminder',
                    handler: () => sendClientAReminder(),
                    icon: warning,
                },
                {
                    text: 'Send an early overdue reminder',
                    handler: () => sendEarlyOverdueReminder(),
                    icon: watch,
                },
                {
                    text: 'Send a late overdue reminder',
                    handler: () => sendLateOverdueReminder(),
                    icon: ellipsisHorizontalCircleSharp,
                },
                {
                    text: 'Concude the job',
                    handler: () => {
                        concludeTheJob()
                    },
                    role: 'destructive',
                    icon: syncCircle,
                },
                {
                    text: 'Cancel',
                    icon: close,
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ],
        })
    }

    React.useEffect(() => {
        isMounted.current && fetchDataFromBackend();
        databaseRef.on("child_added", (snapshot: any) => {
            fetchDataFromBackend();
        });

        databaseRef.on("child_changed", (snapshot: any) => {
            fetchDataFromBackend();
        });

        databaseRef.on("child_removed", (snapshot: any) => {
            fetchDataFromBackend();
        });
        databaseRef.on("child_moved", (snapshot: any) => {
            fetchDataFromBackend();
        });
    }, []);

    React.useLayoutEffect(() => {
        isMounted.current && fetchDataFromBackend();
        capacitorStorageService.get("user")
            .then((res: any) => {
                res && res.value && setUser(JSON.parse(res.value));
            })
            .catch((err: any) => console.error(err))
    }, [])

    function fetchDataFromBackend() {
        let data: any = [];
        return get('/jobs')
            .then((snapshot: any) => {
                for (let id in snapshot.val()) {
                    if (id == "jobs") {
                        Object.keys(snapshot.val()[id])
                            .map((key: any) => {
                                if (key === idQueryParam)
                                    data.push({ ...snapshot.val()[id][key], id: key })
                            });
                    }
                }
                setSingleJobData(data);
            })
            .then((snapshot: any) => setIsLoadingJobsData(false))
            .catch((err: any) => {
                setIsLoadingJobsData(false);
                console.error(err);
            });
    }

    const openUpdateModal = () => {
        return setShowUpdateModal(true);
    }

    const deleteJobData = () => {
        setIsLoadingJobsData(true);
        history.push("/admin/home")
        setTimeout(() => {
            remove('/jobs/' + idQueryParam)
                .then((res: any) => setIsLoadingJobsData(false))
                .catch((err: any) => console.error(err));
        }, 1000);
    }

    return isLoadingJobsData ? (
        <>
            <div className='centered'>
                <IonSpinner className="ion-spinner" color="primary" name="dots" ></IonSpinner>
            </div>
        </>
    ) : (
        <div style={{ marginTop: "-35px" }}>
            <UpdateJobModal
                showUpdateJobModal={showUpdateModal}
                setShowUpdateJobModal={setShowUpdateModal}
                jobId={idQueryParam}
                singleJobData={singleJobData}
            />
            <GridContainer>
                <GridItem className="grid-item" xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>{singleJobData[0].job}</h4>
                            {
                                <p className={classes.cardCategoryWhite}>{singleJobData[0].description}</p>
                            }
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <h3 className={classes.contentHeader}>Client's Name</h3>
                                    <h5 className={classes.contentBody}>{singleJobData[0].clientName}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Client's Email</h3 >
                                    <h5 className={classes.contentBody}>{singleJobData[0].clientEmail ? singleJobData[0].clientEmail : "unset"}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Client's Mobile</h3>
                                    <h5 className={classes.contentBody}>{singleJobData[0].clientPhoneNo}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Location</h3 >
                                    <h5 className={classes.contentBody}>{singleJobData[0].location ? singleJobData[0].location : "unset"}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Created By</h3 >
                                    <h5 className={classes.contentBody}>{singleJobData[0].createdBy}</h5 >
                                    <br />
                                    {
                                        singleJobData[0].updatedBy && (
                                            <>
                                                <h3 className={classes.contentHeader}>Updated By</h3 >
                                                <h5 className={classes.contentBody}>{singleJobData[0].updatedBy}</h5 >
                                                <br />
                                            </>
                                        )
                                    }
                                    {
                                        singleJobData[0].concludedOn && (
                                            <>
                                                <h3 className={classes.contentHeader}>Concluded On</h3 >
                                                <h5 className={classes.contentBody}>{new Date(singleJobData[0].concludedOn).toDateString()}</h5 >
                                                <br />
                                            </>
                                        )
                                    }
                                    {
                                        singleJobData[0].concludedBy && (
                                            <>
                                                <h3 className={classes.contentHeader}>Concluded By</h3 >
                                                <h5 className={classes.contentBody}>{singleJobData[0].concludedBy.username}</h5 >
                                                <br />
                                                <h5 className={classes.contentBody}>{singleJobData[0].concludedBy.email}</h5 >
                                                <br />
                                            </>
                                        )
                                    }
                                    <h3 className={classes.contentHeader}>Archived</h3 >
                                    <h5 className={classes.contentBody}>{singleJobData[0].archieved ? 'true' : "false"}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Date Received</h3 >
                                    <h5 className={classes.contentBody}>{new Date(singleJobData[0].date_created).toDateString()}</h5 >
                                    <br />
                                    <h3 className={classes.contentHeader}>Last Update</h3 >
                                    <h5 className={classes.contentBody}>{new Date(singleJobData[0].last_update).toDateString()}</h5 >
                                    <br />
                                    <br />
                                    <h3 className={classes.contentHeader} style={{ position: "relative", zIndex: 10 }}>Invoices Sent</h3 >
                                    <IonList>
                                        {
                                            singleJobData[0].sentInvoices && (
                                                singleJobData[0].sentInvoices.map((sentInvoice: any, i: number) => {
                                                    return (
                                                        <IonItem >
                                                            <div style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                                                                <h5 className={classes.contentBody} style={{ textTransform: "capitalize" }}>{sentInvoice.type}</h5>
                                                                <h5 className={classes.contentBody}>{new Date(sentInvoice.dateSent).toDateString()}</h5>
                                                            </div>
                                                        </IonItem>
                                                    )

                                                })
                                            )
                                        }

                                    </IonList>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            {
                                !singleJobData[0].archieved && <ChatWidget />
                            }
                            {
                                user && user.isAdmin && (
                                    <div className='d-block col-12'>
                                        <div className='d-flex col-12'>
                                            <Button color="primary" className="col-6" onClick={openUpdateModal}>Update</Button>
                                            <Button color="danger" className="col-6" onClick={deleteJobData}>Delete</Button>
                                        </div>
                                        {!singleJobData[0].archieved && <Button color="secondary" className="col-12" onClick={() => presentIonActionSheet()}>More Options</Button>}
                                    </div>
                                )
                            }
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div >
    );
}

export default withStyles(styles)(SingleJobsPage);
