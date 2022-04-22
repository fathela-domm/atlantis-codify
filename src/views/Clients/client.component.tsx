import "./client.component.css";
import React from 'react';
import { get } from "../../services/firebase/database.module";
import { IonSpinner } from "@ionic/react";
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import { createStyles, withStyles } from "@material-ui/core";
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import { Link } from "react-router-dom";

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
    card: {
        width: "100%"
    },
    contentBody: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "15px",
        left: "20px",
        marginBottom: "-20px",
    }
});

function ClientsComponent(props: any) {
    const [jobs, setJobs] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { classes } = props;
    React.useLayoutEffect(() => {
        fetchDataFromBackend();
    }, [])
    function fetchDataFromBackend() {
        let data: any = [];
        get('/')
            .then((snapshot: any) => {
                for (let id in snapshot.val()) {
                    if (id == "jobs") {
                        Object.keys(snapshot.val()[id])
                            .map((key: any) => {
                                data.push({ ...snapshot.val()[id][key], id: key })
                            });
                    }
                }
            })
            .then((res: any) => {
                setJobs(data);
                setIsLoading(false);
            })
            .catch((err: any) => console.error(err));
    }
    return isLoading ? (
        <div className='centered'>
            <IonSpinner className="ion-spinner" color="primary" name="dots" ></IonSpinner>
        </div>
    ) : (
        <>
            {
                jobs.map((job: any, count: number) => (
                    <div style={{ width: "100%" }} key={Math.random()}>
                        <GridContainer>
                            <Card className={classes.card}>
                                <Link to={`/admin/jobs/` + job.id}>
                                    <CardHeader color={count % 2 === 0 ? "primary" : 'danger'}>
                                        <h4 className={classes.cardTitleWhite}>{job.job}</h4>
                                        {
                                            <p className={classes.cardCategoryWhite}>{job.description}</p>
                                        }
                                    </CardHeader>
                                </Link>
                                <CardBody>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <h3 className={classes.contentHeader}>Client's Name</h3>
                                        <h5 className={classes.contentBody}>{job.clientName}</h5 >
                                        <br />
                                        <h3 className={classes.contentHeader}>Client's Email</h3 >
                                        <h5 className={classes.contentBody}>{job.clientEmail ? job.clientEmail : "unset"}</h5 >
                                        <br />
                                        <h3 className={classes.contentHeader}>Client's Mobile</h3>
                                        <h5 className={classes.contentBody}>{job.clientPhoneNo}</h5 >
                                        <br />
                                    </GridItem>
                                </CardBody>
                            </Card>
                        </GridContainer>
                    </div>
                ))
            }
        </>
    );
}

export default withStyles(styles)(ClientsComponent);
