import React from "react";
import { update } from "../../services/firebase/database.module";
import { IonModal, IonContent, IonButton, IonToolbar, IonTitle, IonText, IonHeader, IonButtons, IonLabel, IonSpinner, useIonAlert } from "@ionic/react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import './home.component.css';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import capacitorStorageModule from "../../services/storage/capacitor-storage.module";

interface CreateJobsModalInterface {
    showCreateJobModal: boolean;
    setShowCreateJobModal: Function;
    setShowInvoiceModal: Function;
    setCreatedJobData: Function;
}

export default function CreateJobModal(props: CreateJobsModalInterface) {
    const { showCreateJobModal, setShowCreateJobModal, setShowInvoiceModal, setCreatedJobData } = props;
    const [job, setJob] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [clientName, setClientName] = React.useState<string>('');
    const [clientEmail, setClientEmail] = React.useState<string>('');
    const [clientPhone, setClientPhone] = React.useState<any>('');
    const [location, setLocation] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [present, dismiss] = useIonAlert();

    const presentIonAlert = (msg: string) => {
        return present({
            message: msg,
            buttons: [
                {
                    text: 'Dismiss',
                    role: 'cancel',
                    handler: () => {
                        dismiss();
                    }
                }
            ],
        });
    }

    function createNewJob() {
        setIsLoading(true);
        // generate random string
        function dec2hex(dec: any) {
            return dec.toString(16).padStart(2, "0")
        }

        // generateId :: Integer -> String
        function generateId(len?: number) {
            var arr = new Uint8Array((len || 40) / 2)
            window.crypto.getRandomValues(arr)
            return Array.from(arr, dec2hex).join('')
        }
        capacitorStorageModule.get('user')
            .then((res: any) => {
                if (res && res.value) {
                    if (clientPhone.length < 8) {
                        presentIonAlert("Please enter a valid client's phone no");
                        return setIsLoading(false);
                    }
                    let user = JSON.parse(res.value);
                    let myCustomJobId: string = generateId();
                    const dataToUpload = {
                        createdBy: user?.displayName,
                        id: myCustomJobId,
                        date_created: new Date(Date.now()).toISOString(),
                        last_update: new Date(Date.now()).toISOString(),
                        archieved: false,
                        job: job,
                        description: description,
                        clientName: clientName,
                        clientPhoneNo: clientPhone,
                        clientEmail: clientEmail,
                        location: location,
                    };
                    update('jobs/' + myCustomJobId, dataToUpload)
                        .then((res: any) => {
                            setCreatedJobData(dataToUpload);
                            setShowInvoiceModal(true);
                        })
                        .then((res: any) => {
                            setTimeout(() => {
                                setIsLoading(false);
                                setShowCreateJobModal(false);
                                setJob("");
                                setDescription('');
                                setClientEmail('');
                                setClientPhone('');
                                setLocation('');
                                setClientName('');
                            }, 1000);
                        })
                        .catch((err: any) => console.error(err));
                }
            })
            .catch((err: any) => console.error(err));
    };

    const inputChangeHandler = {
        jobChange: (e: any) => {
            setJob(e.target.value)
        },
        descriptionChange: (e: any) => {
            setDescription(e.target.value)
        },
        clientNameChange: (e: any) => {
            setClientName(e.target.value)
        },
        clientEmailChange: (e: any) => {
            setClientEmail(e.target.value)
        },
        clientPhoneChange: (value: any) => {
            setClientPhone(value)
        },
        locationChange: (e: any) => {
            setLocation(e.target.value)
        },
    };
    return (
        <IonModal
            isOpen={showCreateJobModal}
            swipeToClose={true}
            cssClass="custom-ion-modal"
            backdropDismiss={false}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle >Job Card</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => setShowCreateJobModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <ValidatorForm
                    onSubmit={createNewJob}
                    onError={errors => console.log(errors)}
                    style={{
                        width: "90%",
                        margin: 'auto'
                    }}
                >
                    <small>
                        <IonText color='warning'>All fields with (*) are required!!</IonText>
                    </small>
                    <TextValidator
                        className="mt-1 mb-2 col-sm-12"
                        label="Job*"
                        fullWidth
                        onChange={inputChangeHandler.jobChange}
                        name="job"
                        value={job}
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                    <TextValidator
                        className="mt-2 mb-2 col-sm-12"
                        label="Description"
                        onChange={inputChangeHandler.descriptionChange}
                        name="description"
                        value={description}
                        fullWidth
                    />
                    <TextValidator
                        className="mt-2 mb-2 col-sm-12"
                        label="Client's Name*"
                        onChange={inputChangeHandler.clientNameChange}
                        name="clientName"
                        value={clientName}
                        fullWidth
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                    <div className="phone-input mt-2 mb-1 col-sm-12">
                        <IonLabel>Client's Phone No*</IonLabel>
                        <PhoneInput
                            // containerStyle={{ margin: 'auto', width: "100%" }}
                            containerClass="col-sm-12"
                            inputStyle={{
                                width: '100%'
                            }}
                            inputProps={{
                                length: 12
                            }}
                            country={'ke'}
                            specialLabel="Client's Phone No*"
                            placeholder={'+254 700 110 011'}
                            value={clientPhone}
                            onChange={inputChangeHandler.clientPhoneChange}
                        />
                    </div>
                    <TextValidator
                        className="mt-2 mb-2 col-sm-12"
                        label="Client's Email*"
                        onChange={inputChangeHandler.clientEmailChange}
                        name="clientEmail"
                        value={clientEmail}
                        fullWidth
                        type="email"
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                    />

                    <TextValidator
                        className="mt-2 mb-2 col-sm-12"
                        label="Location"
                        onChange={inputChangeHandler.locationChange}
                        name="location"
                        value={location}
                        fullWidth
                    />
                    <IonButton disabled={isLoading} className="ion-margin-top" type="submit" expand="block">
                        {
                            !isLoading ? <>Create</> : <IonSpinner></IonSpinner>
                        }
                    </IonButton>
                </ValidatorForm>
            </IonContent>
        </IonModal>
    )
}