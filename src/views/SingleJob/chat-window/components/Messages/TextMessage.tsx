import React from 'react';
import Linkify from 'react-linkify';
import { format } from 'date-fns';
import capacitorStorageService from "../../../../../services/storage/capacitor-storage.module";

interface TextMessageProps {
  data: any;
}

const TextMessage = (props: TextMessageProps) => {
  const [userName, setUserName] = React.useState(null);
  React.useLayoutEffect(() => {
    capacitorStorageService.get('user')
      .then((res: any) => {
        if (res.value)
          setUserName(JSON.parse(res.value).displayName)
      })
      .catch((err: any) => console.error(err));
  }, []);
  return userName && (
    <div className="sc-message--text">
      {
        userName !== props.data.sender && (
          <>
            <span className="sc_message__author">
              {props.data.sender}
            </span>
            <br />
            <br />
          </>
        )
      }
      <Linkify properties={{ target: '_blank' }}>{props.data.text}</Linkify>
      <br />
      <br />
      <span className="row" style={{ fontSize: "smaller" }}>
        <small> {format(new Date(props.data.timestamp), 'MM/dd/yyyy')}</small>
        <small> {format(new Date(props.data.timestamp), 'HH:mm')} hrs</small>
      </span>
    </div>
  );
};

export default TextMessage;
