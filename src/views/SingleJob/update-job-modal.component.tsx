import React from "react";
import { update } from "../../services/firebase/database.module";
import { IonModal, IonContent, IonButton, IonToolbar, IonTitle, IonText, IonHeader, IonButtons, IonLabel, IonSpinner } from "@ionic/react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import './singlejob.component.css';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import capacitorStorageModule from "../../services/storage/capacitor-storage.module";
import { Switch, FormControl, FormControlLabel } from "@material-ui/core";

interface UpdateJobModalProps {
    singleJobData: any;
    showUpdateJobModal: boolean;
    jobId: string;
    setShowUpdateJobModal: Function;
}

export default function UpdateJobModal(props: UpdateJobModalProps) {
    const { showUpdateJobModal, setShowUpdateJobModal, jobId, singleJobData } = props;
    const [job, setJob] = React.useState<any>(singleJobData[0].job || '');
    const [description, setDescription] = React.useState<any>(singleJobData[0].description || '');
    const [clientName, setClientName] = React.useState<any>(singleJobData[0].clientName || '');
    const [clientEmail, setClientEmail] = React.useState<any>(singleJobData[0].clientEmail || '');
    const [clientPhone, setClientPhone] = React.useState<any>(singleJobData[0].clientPhoneNo || '');
    const [location, setLocation] = React.useState<any>(singleJobData[0].location || '');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [archieved, setArchieved] = React.useState<boolean>(singleJobData[0].archieved);

    function updateJob() {
        setIsLoading(true);
        capacitorStorageModule.get('user')
            .then((res: any) => {
                if (res && res.value) {
                    let user = JSON.parse(res.value);
                    const dataToUpload = {
                        updatedBy: user?.displayName,
                        last_update: new Date(Date.now()).toISOString(),
                        archieved: archieved,
                        job: job,
                        description: description,
                        clientName: clientName,
                        clientPhoneNo: clientPhone,
                        clientEmail: clientEmail,
                        location: location,
                    };
                    update(`/jobs/${jobId}`, dataToUpload)
                        .then((res: any) => {
                            setIsLoading(false);
                            setShowUpdateJobModal(false);
                            // send toast to the creator telling them a job has been created
                            // send notification to admin telling them a job has been created
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
        archievedChange: (e: any) => {
            setArchieved(e.target.checked)
        },
    };
    return (
        <IonModal
            isOpen={showUpdateJobModal}
            swipeToClose={true}
            cssClass="custom-ion-modal"
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle >Job Card</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => setShowUpdateJobModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <ValidatorForm
                    onSubmit={updateJob}
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
                        className="mt-1 mb-1 col-sm-12"
                        label="Job*"
                        fullWidth
                        onChange={inputChangeHandler.jobChange}
                        name="job"
                        value={job}
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                    <TextValidator
                        className="mt-1 mb-1 col-sm-12"
                        label="Description"
                        onChange={inputChangeHandler.descriptionChange}
                        name="description"
                        value={description}
                        fullWidth
                    />
                    <TextValidator
                        className="mt-1 mb-1 col-sm-12"
                        label="Client's Name*"
                        onChange={inputChangeHandler.clientNameChange}
                        name="clientName"
                        value={clientName}
                        fullWidth
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                    <div className="phone-input mt-1 mb-1 col-sm-12">
                        <IonLabel>Client's Phone No*</IonLabel>
                        <PhoneInput
                            // containerStyle={{ margin: 'auto', width: "100%" }}
                            containerClass="col-sm-12"
                            inputStyle={{
                                width: '100%'
                            }}
                            country={'ke'}
                            specialLabel="Client's Phone No*"
                            placeholder={'+254 700 110 011'}
                            value={clientPhone}
                            onChange={inputChangeHandler.clientPhoneChange}
                        />
                    </div>
                    <TextValidator
                        className="mt-1 mb-1 col-sm-12"
                        label="Client's Email*"
                        onChange={inputChangeHandler.clientEmailChange}
                        name="clientEmail"
                        type="email"
                        value={clientEmail}
                        fullWidth
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                    />

                    <TextValidator
                        className="mt-1 mb-1 col-sm-12"
                        label="Location*"
                        onChange={inputChangeHandler.locationChange}
                        name="location"
                        value={location}
                        fullWidth
                    />
                    <FormControl>
                        <FormControlLabel
                            label="Send To Archive"
                            control={
                                <Switch checked={archieved} onChange={inputChangeHandler.archievedChange} name="Archived" />
                            }
                        />
                    </FormControl>
                    <IonButton className="ion-margin-top" type="submit" expand="block">
                        {
                            !isLoading ? <>Update</> : <IonSpinner></IonSpinner>
                        }
                    </IonButton>
                </ValidatorForm>
            </IonContent>
        </IonModal>
    )
}