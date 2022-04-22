import React from 'react';
import { get, create, databaseRef } from "../../services/firebase/database.module";
import "./singlejob.component.css";
import useIsMounted from '../../hooks/ismounted-hook.module';
import { QueryParameterInterface } from './SingleJob.page';
import { useParams } from 'react-router';
import Launcher from "./chat-window";
import capacitorStorageService from "../../services/storage/capacitor-storage.module";

export default function ChatWidget() {
    const isMounted = useIsMounted();
    const [messages, setMessages] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { idQueryParam } = useParams<QueryParameterInterface>();
    const [jobName, setJobName] = React.useState<any>(null);

    function fetchDataFromBackend() {
        let data: any[] = [];
        let job: string = '';
        return get('/jobs')
            .then((snapshot: any) => {
                for (let id in snapshot.val()) {
                    if (id == "jobs" && snapshot.val()[id]) {
                        Object.keys(snapshot.val()[id])
                            .map((key: any) => {
                                if (key === idQueryParam) {
                                    job = snapshot.val()[id][key]['job'];
                                    snapshot.val()[id][key]['messages'] && Object.keys(snapshot.val()[id][key]['messages']).map((messageId: any) => {
                                        data.push({ ...snapshot.val()[id][key]['messages'][messageId], id: messageId });
                                    });
                                }
                            });
                    }
                }
            })
            .then((res: any) => {
                capacitorStorageService.get("user")
                    .then((res: any) => {
                        data.map((message: any) => {
                            if (res && res.value) {
                                // setting the authors name to determine what side it'll display the chat message area
                                const user = JSON.parse(res.value);
                                message['author'] = message.data.sender == user['displayName'] ? 'me' : "them";
                            }
                        });
                    })
                    .then((snapshot: any) => {
                        setMessages(data);
                        setJobName(job);
                        setIsLoading(false)
                    })
                    .catch((err: any) => console.error(err));
            })
            .catch((err: any) => {
                setIsLoading(false);
                console.error(err);
            });
    }

    React.useLayoutEffect(() => {
        isMounted.current && fetchDataFromBackend();
        databaseRef.on("child_added", (snapshot: any) => {
            fetchDataFromBackend();
        });
        databaseRef.on("child_moved", (snapshot: any) => {
            fetchDataFromBackend();
        });
        databaseRef.on("child_changed", (snapshot: any) => {
            fetchDataFromBackend();
        });
        databaseRef.on("child_removed", (snapshot: any) => {
            fetchDataFromBackend();
        });
    }, []);

    const handleNewUserMessage = (newMessage: any) => {
        capacitorStorageService.get("user")
            .then((res: any) => {
                if (res && res.value) {
                    const user = JSON.parse(res.value);
                    let message = newMessage;
                    message['data']["sender"] = user['displayName'];
                    message['data']["timestamp"] = new Date().toISOString();
                    delete message['author'];
                    return create(`/jobs/${idQueryParam}/messages`, message);
                }
            });
    }

    return isLoading ? null : (
        <div className="chat-widget-container">
            <Launcher
                newMessagesCount={messages.length}
                agentProfile={{
                    teamName: jobName,
                    teamExplanation: 'A chatbot'
                }}
                showFileIcon={false}
                onMessageWasSent={handleNewUserMessage}
                messageList={messages}
                showEmoji={true}
            />
        </div>
    )
}