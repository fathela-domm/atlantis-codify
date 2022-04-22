import React from "react";
import { get, databaseRef } from "../services/firebase/database.module";
import useIsMounted from "./ismounted-hook.module";
import { post } from "../services/internet-services/http-service.module";

export default function useJobReminder() {
    const [jobs, setJobsData] = React.useState<any>([]);
    const [users, setUsers] = React.useState<any>([]);
    const isMounted = useIsMounted();
    function fetchDataFromBackend() {
        return get('/')
            .then((snapshot: any) => {
                let data: any = [];
                for (let id in snapshot.val()) {
                    if (id == "jobs") {
                        Object.keys(snapshot.val()[id])
                            .map((key: any) => {
                                data.push({ ...snapshot.val()[id][key], id: key })
                            });
                    }
                }
                setJobsData(data);
            })
            .then((res: any) => {
                get('/')
                    .then((snapshot: any) => {
                        let users: any = [];
                        for (let id in snapshot.val()) {
                            if (id == "users") {
                                Object.keys(snapshot.val()[id])
                                    .map((key: any) => {
                                        users.push({ ...snapshot.val()[id][key], id: key })
                                    });
                            }
                        }
                        setUsers(users);
                    })
                    .catch((err: any) => {
                        console.error(err);
                    });
            })
            .catch((err: any) => {
                console.error(err);
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

    function _Main(users: any, jobs: any) {
        if (users && jobs) {
            jobs.map((job: any) => {
                if (new Date(job.date_created).getTime() < new Date().getTime() - 86400000 * 7 && !job.archieved)
                    users.map((user: any) => {
                        if (user.registrationToken && user.isAdmin) {
                            return post("/cloudMessaging/sendCloudMessage", {
                                registrationTokens: user.registrationToken,
                                message: {
                                    title: "Just a reminder",
                                    body: "Job <<" + job?.job + ">> has been living in our database for more than 7 days."
                                },
                                jobId: job?.id
                            })
                        }
                    });
            });
        }
    }

    React.useLayoutEffect(() => {
        isMounted.current && fetchDataFromBackend();
        _Main(users, jobs);
    }, [])
}