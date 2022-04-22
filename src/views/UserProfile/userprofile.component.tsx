import "./userprofile.component.css";
import React from "react";
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardAvatar from '../../components/Card/CardAvatar';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import { createStyles } from '@material-ui/core';
import { IonSpinner } from "@ionic/react";
import capacitorStorageService from "../../services/storage/capacitor-storage.module";
import { get, update } from "../../services/firebase/database.module";
import { CameraAlt } from "@material-ui/icons";
import { Fab } from "@material-ui/core";
import firebase from "../../services/firebase/firebase.config";
import { useIonToast } from "@ionic/react";
import UpdateProfileModalComponent from "./update-profile-modal.component";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// comming soon

export const styles = createStyles({
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
    },
    cardHeader: {
        position: 'relative'
    }
});

function UserProfileComponent(props: any) {
    const { classes } = props;
    const [currentUser, setCurrentUser] = React.useState<any>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [present, dismiss] = useIonToast();
    const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

    const showToast = (msg: string) => {
        return present({
            message: msg,
            duration: 3000,
            onDidDismiss: () => dismiss(),
        });
    };

    function updateProfilePhoto(e: any) {
        setIsUpdating(true);
        let storageRef = firebase.storage().ref("users/");
        return storageRef.child(currentUser.displayName)
            .put(e.target.files[0])
            .then((snapshot: firebase.storage.UploadTaskSnapshot) => {
                // get download url and update the user object
                snapshot.ref.getDownloadURL()
                    .then(async (url: string) => {
                        await update('/users/' + currentUser.id, { photoURL: url })
                            .then((res: any) => {
                                showToast('Profile photo successfully updated');
                                setIsUpdating(false);
                            })
                            .then((res: any) => {
                                setCurrentUser({ ...currentUser, photoURL: url })
                            })
                            .catch((err: any) => {
                                console.error(err);
                                showToast(':( Profile photo could not be updated. Please check the integrity of your network.')
                                setIsUpdating(false);
                            })
                    })
                    .catch((err: any) => {
                        console.error(err);
                        showToast(':( Profile photo could not be updated. Please check the integrity of your network.')
                    })
            })
            .catch((err: any) => {
                console.error(err);
                showToast(':( Profile photo could not be updated. Please check the integrity of your network.')
            })
    }

    React.useLayoutEffect(() => {
        capacitorStorageService.get('user')
            .then((res: any) => {
                if (res&&res.value) {
                    let userObject = JSON.parse(res.value);
                    let data: any;
                    get("/")
                        .then((snapshot: any) => {
                            let data: any = {};
                            for (let id in snapshot.val()) {
                                if (id == "users") {
                                    Object.keys(snapshot.val()[id])
                                        .map((key: any) => {
                                            if (snapshot.val()[id][key]["email"] == userObject["email"]) {
                                                setCurrentUser({ ...snapshot.val()[id][key], id: key });
                                                setIsLoading(false);
                                            }
                                            else if (snapshot.val()[id][key]["phoneNo"] == userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] !== "" && userObject["phoneNo"].length !== 0) {
                                                setCurrentUser({ ...snapshot.val()[id][key], id: key });
                                                setIsLoading(false);
                                            }
                                        });
                                }
                            }
                        })
                        .catch((err: any) => console.error(err))
                }
            })
            .catch((err: any) => console.error(err))
    }, []);

    return isLoading ? (
        <div className='centered'>
            <IonSpinner className="ion-spinner" color="primary" name="dots" ></IonSpinner>
        </div>
    ) : (
        <div>
            <UpdateProfileModalComponent
                setShowCreateModal={setShowUpdateModal}
                showCreateModal={showUpdateModal}
                setCurrentUser={setCurrentUser}
                user={currentUser}
            />
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <div className="profile">
                        <Card profile={true}>
                            <CardHeader className={classes.cardHeader} >
                                <div style={{ position: "relative", marginBottom: "-80px" }}>
                                    <CardAvatar profile={true}>
                                        {
                                            isUpdating ? (
                                                <IonSpinner className="ion-spinner" style={{ zoom: 2.3 }} color="secondary" name="dots" ></IonSpinner>
                                            ) : (
                                                <LazyLoadImage
                                                    src={currentUser.photoURL} alt="..."
                                                />
                                            )
                                        }
                                    </CardAvatar>
                                    <div className="file-input-fab">
                                        <Fab component="label" color="primary">
                                            <CameraAlt />
                                            <input accept="image/png, image/jpeg" onChange={updateProfilePhoto} type="file" hidden />
                                        </Fab>
                                    </div>
                                </div>

                            </CardHeader>
                            <CardBody profile={true}>
                                <h3 className={classes.contentHeader}>Name</h3>
                                <h5 className={classes.contentBody}>{currentUser.displayName}</h5 >
                                <br />
                                <h3 className={classes.contentHeader}>Email</h3>
                                <h5 className={classes.contentBody}>{currentUser.email}</h5 >
                                <br />
                                {
                                    currentUser.phoneNo && (
                                        <>
                                            <h3 className={classes.contentHeader}>PhoneNo</h3>
                                            <h5 className={classes.contentBody}>{currentUser.phoneNo}</h5 >
                                            <br />
                                        </>
                                    )
                                }
                                <Button color="primary" onClick={() => setShowUpdateModal(true)} round={true}>
                                    Update Profile
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    );
}

export default withStyles(styles)(UserProfileComponent);
