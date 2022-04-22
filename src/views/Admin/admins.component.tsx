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
import { get, remove, update } from "../../services/firebase/database.module";
import { useIonToast } from "@ionic/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { databaseRef } from "../../services/firebase/database.module";
import useIsMounted from "../../hooks/ismounted-hook.module";
import capacitorStorageService from "../../services/storage/capacitor-storage.module"
import "../UserProfile/userprofile.component.css";
import { styles } from "../UserProfile/userprofile.component";

function AdminsPage(props: any) {
    const { classes } = props;
    const [users, setUsers] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [present, dismiss] = useIonToast();
    const isMounted = useIsMounted();

    const showToast = (msg: string) => {
        return present({
            message: msg,
            duration: 3000,
            onDidDismiss: () => dismiss(),
        });
    };

    function deleteUser(uid: string) {
        remove("/users/" + uid)
            .then((res: any) => {
                showToast(`User <<${uid}>> successfully deleted.`);
            }).catch((err: any) => {
                console.error(err);
                showToast(`:( User <<${uid}>> may not have been successfully deleted.`);
            })
    }

    function fetchUsers() {
        capacitorStorageService.get('user')
            .then((res: any) => {
                if (res &&res.value) {
                    let userObject = JSON.parse(res.value);
                    let data: any[] = [];
                    return get("/")
                        .then((snapshot: any) => {
                            let data: any[] = [];
                            for (let id in snapshot.val()) {
                                if (id == "users")
                                    Object.keys(snapshot.val()[id])
                                        .map((key: any) => {
                                            if (snapshot.val()[id][key]["email"] !== userObject["email"] && snapshot.val()[id][key]["isAdmin"]) {
                                                data.push({ ...snapshot.val()[id][key], id: key });
                                            }
                                            else if (snapshot.val()[id][key]["isAdmin"] && snapshot.val()[id][key]["phoneNo"] !== userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] !== "" && userObject["phoneNo"].length !== 0) {
                                                data.push({ ...snapshot.val()[id][key], id: key });
                                            }
                                        });
                            }
                            setUsers(data);
                            setIsLoading(false);
                        })
                        .catch((err: any) => console.error(err))
                }
            })
            .catch((err: any) => console.error(err))
    }

    async function demoteUser(uid: string) {
        return await update('/users/' + uid, { isAdmin: false });
    }

    React.useLayoutEffect(() => {
        isMounted.current && fetchUsers();
        databaseRef.on("child_added", (snapshot: any) => {
            fetchUsers();
        });

        databaseRef.on("child_changed", (snapshot: any) => {
            fetchUsers();
        });

        databaseRef.on("child_removed", (snapshot: any) => {
            fetchUsers();
        });
        databaseRef.on("child_moved", (snapshot: any) => {
            fetchUsers();
        });
    }, []);

    return isLoading ? (
        <div className='centered'>
            <IonSpinner className="ion-spinner" color="primary" name="dots" ></IonSpinner>
        </div>
    ) : users.map((user: any) => (
        <div key={Math.random()}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <div className="profile">
                        <Card profile={true}>
                            <CardHeader className={classes.cardHeader} >
                                <div style={{ position: "relative", marginBottom: "-40px" }}>
                                    <CardAvatar profile={true}>
                                        <LazyLoadImage
                                            src={user.photoURL} alt="..."
                                        />
                                    </CardAvatar>
                                </div>

                            </CardHeader>
                            <CardBody profile={true}>
                                <h3 className={classes.contentHeader}>Name</h3>
                                <h5 className={classes.contentBody}>{user.displayName}</h5 >
                                <br />
                                <h3 className={classes.contentHeader}>Email</h3>
                                <h5 className={classes.contentBody}>{user.email}</h5 >
                                <br />
                                {
                                    user.phoneNo && (
                                        <>
                                            <h3 className={classes.contentHeader}>Phone No</h3>
                                            <h5 className={classes.contentBody}>{user.phoneNo}</h5 >
                                            <br />
                                        </>
                                    )
                                }
                                <Button color="primary" onClick={() => demoteUser(user.id)} round={true}>
                                    Demote
                                </Button>
                                <Button color="danger" onClick={() => deleteUser(user.id)} round={true}>
                                    Delete User
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    ));
}

export default withStyles(styles)(AdminsPage);
