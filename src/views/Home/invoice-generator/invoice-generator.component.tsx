import React from "react";
import "./scss/main.scss";
import InvoicePage from './components/InvoicePage';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, useIonAlert, IonSpinner, useIonToast } from '@ionic/react';
import { post } from "../../../services/internet-services/http-service.module";
import { get, update } from "../../../services/firebase/database.module";
import { Invoice } from './data/types';

interface InvoiceGeneratorProps {
    setIsShowing: Function;
    isShowing: boolean;
    createdJobData: any;
}

function InvoiceGenerator(props: InvoiceGeneratorProps) {
    const { isShowing, setIsShowing, createdJobData } = props;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [present, dismiss] = useIonToast();
    const [invoiceData, setInvoiceData] = React.useState<any>({});
    const [isDisabled, setDisabled] = React.useState<boolean>(true);
    const [presentIonicAlert, dismissIonicAlert] = useIonAlert();

    const showToast = (msg: string) => {
        return present({
            message: msg,
            duration: 5000,
            onDidDismiss: () => dismiss(),
        });
    };

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

    const submit = (e: any) => {
        if (!invoiceData.title || !invoiceData.clientAddress2 || !invoiceData.clientCountry || !invoiceData.invoiceTitle || !invoiceData.clientName || !invoiceData.companyCountry || !invoiceData.companyAddress2) {
            return presentIonicAlert("All fields are required");
        }
        else if (!invoiceData.subTotal) {
            return presentIonicAlert('Please add some product lines. Invoice total cannot be equal to 0.')
        }
        setIsLoading(true);
        showToast('Generating email to send to ' + createdJobData?.clientName);
        if (createdJobData?.id) {
            update('/jobs/' + createdJobData?.id, {
                invoiceData: invoiceData,
                sentInvoices: [
                    {
                        type: "initial invoice",
                        dateSent: new Date().toISOString(),
                    }
                ]
            })
                .then((res: any) => {
                    // send mail invoice to client
                    post('/sendMail', {
                        invoiceData: invoiceData,
                        receiver: createdJobData?.clientEmail
                    })
                        .then((res: any) => {
                            showToast("Email successfully sent  to client " + createdJobData?.clientEmail);
                            // send sms to client that an email has been received
                            post('/sendSMS', {
                                message: `Job <<${createdJobData?.job}>> has been successfully received.\nWe have sent an invoice to your email ${createdJobData?.clientEmail}. Kindly check your inbox.\nIf you didn't receive an email, check your spam folder or contact us right away.\nRegards `,
                                receiver: `+${createdJobData?.clientPhoneNo}`
                            })
                                .then((res: any) => {
                                    showToast("Client has been notified. SMS sent to +" + createdJobData?.clientPhoneNo);
                                    setIsShowing(false);
                                })
                                .catch((err: any) => {
                                    showToast("Job added but client and target employees may not have been notified.\nPlease check the integrity of your network ):");
                                    console.error(err);
                                    setDisabled(false);
                                    setIsLoading(false);
                                    setIsShowing(false);
                                });
                        })
                        .then((res: any) => {
                            // notify all members that a new job has been added
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
                                                title: "New Job -> " + createdJobData?.job,
                                                body: "A new Job <<" + createdJobData?.job + ">> has been added to the database."
                                            },
                                            jobId: createdJobData?.id
                                        })
                                            .then((res: any) => {
                                                // show creator that a job has been created using ion toast. Set loading => false
                                                showToast("Job " + createdJobData?.job + " successfully created");
                                                setDisabled(false);
                                                setIsLoading(false);
                                                setIsShowing(false);
                                            })
                                    } else {
                                        showToast("Job added but notifications not sent to the employees.\nConsider informing them manually.");
                                        setDisabled(false);
                                        setIsLoading(false);
                                        setIsShowing(false);
                                    }
                                })
                                .catch((err: any) => {
                                    showToast("Job added but notifications not sent to the employees.\nConsider informing them manually.");
                                    console.error(err);
                                    setDisabled(false);
                                    setIsLoading(false);
                                    setIsShowing(false);
                                })
                        })
                        .catch((err: any) => {
                            showToast("Job added but client and target employees may not have been notified.\nPlease check the integrity of your network ):");
                            console.error(err);
                            setDisabled(false);
                            setIsLoading(false);
                            setIsShowing(false);
                        });
                })
                .catch((err: any) => {
                    showToast(err?.message || "An error has occured when during the operation.\nJob added with some errors.")
                    console.error(err)
                });
        }
    }

    let initialInvoiceData: Invoice = {
        logo: '',
        logoWidth: 100,
        title: 'INVOICE',
        companyName: 'Atlantis',
        name: '',
        companyAddress: '',
        companyAddress2: 'Nairobi',
        companyCountry: 'Kenya',
        billTo: 'Bill To:',
        clientName: createdJobData?.clientName,
        clientAddress: '',
        clientAddress2: 'Nairobi',
        clientCountry: 'Kenya',
        invoiceTitleLabel: 'Invoice #',
        invoiceTitle: (Math.floor(Math.random() * 90000) + 10000).toString(),
        invoiceDateLabel: 'Date',
        invoiceDate: new Date().toDateString(),
        invoiceDueDateLabel: 'DueDate',
        invoiceDueDate: new Date(new Date().getTime() + 86400000 * 30).toDateString(),
        productLineDescription: 'Description',
        productLineQuantity: 'Frequency',
        productLineQuantityRate: 'Rate',
        productLineQuantityAmount: 'Amount',
        productLines: [
            {
                description: createdJobData?.job,
                quantity: '1',
                rate: '0.00',
            }
        ],
        subTotalLabel: 'Total',
        taxLabel: 'Sale Tax (10%)',
        totalLabel: 'TOTAL',
        currency: 'KSH:',
        notesLabel: 'Notes',
        notes: 'It was great doing business with you.',
        termLabel: 'Terms & Conditions',
        term: 'Please make the payment by the due date.',
    }

    return (
        <>
            <IonModal
                isOpen={isShowing}
                swipeToClose={true}
                cssClass="custom-ion-modal"
                backdropDismiss={false}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle >Invoice</IonTitle>
                        <IonButtons aria-disabled={isDisabled} slot="end">
                            <IonButton disabled={isDisabled} color="danger" onClick={() => setIsShowing(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div className="invoice-generator-app">
                        <InvoicePage data={initialInvoiceData} setInvoiceData={setInvoiceData} />
                    </div>
                    <IonButton disabled={isLoading} className="col-12" style={{ marginTop: "-15px", width: "100%" }} onClick={submit}>
                        {
                            !isLoading ? <>Send Email</> : <IonSpinner></IonSpinner>
                        }
                    </IonButton>
                </IonContent>
            </IonModal>
        </>
    )
}

export default InvoiceGenerator;
