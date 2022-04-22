import "./archieve.page.css";
import React from 'react';
import JobsDataInterface from '../../helpers/data-schema.module';
import { validateDaysDate, groupJSONData } from "../Home/home-utils.module";
import { get, databaseRef } from "../../services/firebase/database.module";
import { IonSpinner } from "@ionic/react";
import "../Home/home.component.css";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import withStyles from '@material-ui/core/styles/withStyles';
import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Accordion from '@material-ui/core/Accordion';
import { DatePicker } from "@material-ui/pickers";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    IonRefresher, IonRefresherContent, IonButton
} from "@ionic/react";
import useIsMounted from "../../hooks/ismounted-hook.module";
interface ArchivedPageProps {
    classes: any;
}
/**
 * 
 * Returns a List of the undone jobs 
 * @param props ArchivedPageProps
 * @returns ArchivedPageJSX
 */
function ArchivedPage(props: ArchivedPageProps) {
    const { classes } = props;
    const [jobs, setJobs] = React.useState<any>({});
    const [isLoadingJobsData, setIsLoadingJobsData] = React.useState<boolean>(true);
    const [filterInputValue, setFilterInputValue] = React.useState<any>('');
    const [filter, setFilter] = React.useState<any>('clientName');
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [filteredByDate, setFilteredByDate] = React.useState<any>(null);
    const [isMatAccordionExpanded, setIsMatAccordionExpanded] = React.useState<boolean>(false);
    const isMounted = useIsMounted();
    React.useLayoutEffect(() => {
        isMounted.current && fetchDataFromBackend();
    }, []);

    const filterDataList = (e: any) => {
        setFilterInputValue(e.target.value);
        fetchDataFromBackend();
    }
    const showErrorAlert = (msg: string) => console.error(msg);

    async function filterByLastUpdate(value: any) {
        setSelectedDate(value);
        // close the accordion
        setIsMatAccordionExpanded(false);
        const jobsDataKeys = Object.keys(jobs);
        let filteredData: any = {};
        jobsDataKeys.map((key: string) => {
            if (new Date(key).toDateString() === new Date(value).toDateString())
                filteredData[key] = (jobs[key]);
        });
        setFilteredByDate(filteredData);
    }

    function fetchDataFromBackend() {
        let data: any = [];
        return get('/')
            .then((snapshot: any) => {
                for (let id in snapshot.val()) {
                    if (id == "jobs") {
                        Object.keys(snapshot.val()[id])
                            .map((key: any) => {
                                if (snapshot.val()[id][key]['archieved']) {
                                    if (filterInputValue !== '') {
                                        let regexp = new RegExp(`${filterInputValue}`, 'gi');
                                        return snapshot.val()[id][key][filter].match(regexp) && data.push({ ...snapshot.val()[id][key], id: key });
                                    }
                                    data.push({ ...snapshot.val()[id][key], id: key })
                                }
                            });
                    }
                }
            })
            .then((snapshot: any) => {
                // sort the data snapshot result and set the jobs {} to it
                let result: any = {};
                let response = groupJSONData(data, "date_created");
                var objKeys = Object.keys(response);
                objKeys.sort(function (a: any, b: any) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b).getTime() - new Date(a).getTime();
                });
                objKeys.map((key: any) => {
                    result[key] = response[key];
                });
                setJobs(result);
            })
            .then((snapshot: any) => setIsLoadingJobsData(false))
            .catch((err: any) => {
                setIsLoadingJobsData(false);
                showErrorAlert(err.message ? err.message : "An error has occured when processing the application.");
            });
    }

    // Event database listeners to update data in real time
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

    const ionRefreshHandler = (event: any) => {
        fetchDataFromBackend()
            .then((res: any) => {
                setTimeout(() => {
                    event.detail.complete();
                }, 5000);
            })
            .catch((err: any) => {
                setTimeout(() => {
                    event.detail.complete();
                }, 5000);
                showErrorAlert(err.message)
            });
    }


    return isLoadingJobsData ? (
        <div className='centered'>
            <IonSpinner className="ion-spinner" color="primary" name="dots" ></IonSpinner>
        </div>
    ) : (
        <div style={{
            marginTop: "-20px",
            marginBottom: "-80px"
        }}>
            <GridContainer >
                <IonRefresher style={{ position: "absolute", zIndex: "100" }} slot="fixed" onIonRefresh={ionRefreshHandler}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <GridItem xs={12} sm={12} md={12}>
                    <Accordion expanded={isMatAccordionExpanded}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick={() => setIsMatAccordionExpanded(!isMatAccordionExpanded)}
                        >
                            <Typography>Filter</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Card style={{
                                outline: "none",
                                boxShadow: "none",
                                marginTop: "-20px",
                            }}>
                                <CardBody>
                                    <FormControl style={{ margin: 1, width: "100%" }}>
                                        <InputLabel id="demo-simple-select-helper-label">Filter Field</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            label="Filter By"
                                            onChange={(event) => setFilter(event.target.value)}
                                            value={filter}
                                        >
                                            <MenuItem value={'clientName'}>Client's Name</MenuItem>
                                            <MenuItem value={'job'}>Job</MenuItem>
                                            <MenuItem value={'createdBy'}>Created By</MenuItem>
                                        </Select>
                                        <FormHelperText>Filter the jobs list by</FormHelperText>
                                    </FormControl>
                                    <br />
                                    <br />
                                    <FormControl style={{ margin: 1, width: "100%" }}>
                                        <TextField id="outlined-basic" autoComplete='off' value={filterInputValue} onInput={filterDataList} label="Value" variant="outlined" />
                                    </FormControl>
                                    <br />
                                    <br />
                                    <FormControl style={{ margin: 1, width: "100%" }}>
                                        <DatePicker
                                            autoOk
                                            label="Last Update"
                                            animateYearScrolling
                                            value={selectedDate}
                                            onChange={filterByLastUpdate}
                                        />
                                    </FormControl>
                                    <br />
                                    <br />
                                    <IonButton onClick={() => {
                                        setIsLoadingJobsData(true);
                                        setFilteredByDate(null);
                                        fetchDataFromBackend();
                                    }}>Reset</IonButton>
                                </CardBody>
                            </Card>
                        </AccordionDetails>
                    </Accordion>
                </GridItem>
                {
                    Object.keys(filteredByDate ? filteredByDate : jobs)
                        .map((key: any, count: number) => {
                            return (
                                <React.Fragment key={Math.random()}>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <Card>
                                            <CardHeader color={count % 2 === 0 ? "warning" : 'danger'}>
                                                <h4 className={classes.cardTitleWhite}>{validateDaysDate(key)}</h4>
                                                <p className={classes.cardCategoryWhite}>
                                                    {new Date(key).toDateString()}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Table
                                                    tableHeaderColor={count % 2 === 0 ? "warning" : 'danger'}
                                                    tableHead={['Job', 'Client']}
                                                    tableData={
                                                        !filteredByDate ? (
                                                            jobs[key].map((job: JobsDataInterface) => {
                                                                return [
                                                                    <Link to={`/admin/jobs/${job.id}`} >{job.job}</Link>,
                                                                    <Link style={{ color: "#444" }} to={`/admin/jobs/${job.id}`} >{job.clientName}</Link>,
                                                                ]
                                                            })
                                                        ) : (
                                                            filteredByDate[key].map((job: JobsDataInterface) => {
                                                                return [
                                                                    <Link to={`/admin/jobs/${job.id}`} >{job.job}</Link>,
                                                                    <Link style={{ color: "#444" }} to={`/admin/jobs/${job.id}`} >{job.clientName}</Link>,
                                                                ]
                                                            })
                                                        )
                                                    }
                                                />
                                            </CardBody>
                                        </Card>
                                    </GridItem>
                                </React.Fragment>
                            )
                        })
                }
            </GridContainer>
        </div>
    )
}

export default withStyles(dashboardStyle)(ArchivedPage)