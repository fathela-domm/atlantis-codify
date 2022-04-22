import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import logo from "../assets/img/logo.jpg";
import Card from '../components/Card/Card';
import CardHeader from '../components/Card/CardHeader';
import CardIcon from '../components/Card/CardIcon';
import CardBody from '../components/Card/CardBody';
import GridItem from '../components/Grid/GridItem';
import GridContainer from '../components/Grid/GridContainer';
import LocalOffer from '@material-ui/icons/LocalOffer';
import CardFooter from '../components/Card/CardFooter';
import dashboardStyle from '../assets/jss/material-dashboard-react/views/dashboardStyle';
import withStyles from '@material-ui/core/styles/withStyles';
import "./signin-component.css";
import background from "../assets/img/bg.jpg";
import SignInForm from "./signin-form.component";
import capacitorStorage from '../services/storage/capacitor-storage.module';
import InactiveUserComponent from "./inactive-user-component";
import { GetResult } from "@capacitor/storage";
import { IonContent } from '@ionic/react';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            width: "100%",
            justifyContent: "center",
        },
        grid: {
            overflowY: "auto",
            overflowX: "hidden",
        },
        toggleShowPassword: {
            position: "static"
        },
        muiCard: {
            position: "relative",
            height: "auto",
            marginTop: "-10px",
            border: "none",
            outline: "none",
            boxShadow: "none",
            overflowY: "auto",
            overflowX: "hidden",
            background: 'transparent',
            bottom: 0,
        },
        muiCardHeader: {
            position: "relative",
            top: "30px",
        },
        muiCardBody: {
            position: "relative",
            marginTop: '100px',
        },
        muiCardFooter: {
            position: "relative",
            top: "50px",
        },
        formField: {
            width: "100%",
            justifyContent: "center",
            color: 'red',
        },
        submitButton: {
            width: "98%",
            margin: "auto"
        },
        iconContainer: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "auto",
        },
        logo: {
            height: "120px",
            width: "120px",
            borderRadius: "60%",
            justifSelf: "center",
            margin: "auto",
            position: "relative",
            top: "20px",
        }
    })
);

export interface Props {
    classes: any;
}

function SignInComponent(props: Props) {
    const styles = useStyles();
    return (
        <IonContent
            style={{
                '--background': `url(${background})`,
                backgroundPosition: "center",
                backgroundsize: "100% 100%",
                backgroundRepeat: "no-repeat",
            }}
        >
            <GridContainer
                className={styles.grid}
                alignItems="center"
                justifyContent="center"
                container
                spacing={0}
            >
                <GridItem xs={12} sm={6} md={6} >
                    <Card className={styles.muiCard}>
                        <CardHeader className={styles.muiCardHeader} color="none" stats={true} icon={true}>
                            <CardIcon color="none" className={styles.iconContainer}>
                                <img src={logo} className={styles.logo} />
                            </CardIcon>
                        </CardHeader>
                        <CardBody className={styles.muiCardBody}>
                            <SignInForm />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </IonContent >
    )
}
export default withStyles(dashboardStyle)(SignInComponent);
