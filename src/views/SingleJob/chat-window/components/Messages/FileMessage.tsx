import React from 'react';
import FileIcon from '../icons/FileIcon';

interface FileMessageProps {
  data: any;
}

const FileMessage = (props: FileMessageProps) => {
  return (
    <a className="sc-message--file" href={props.data.url} download={props.data.fileName}>
      <FileIcon />
      <p>{props.data.fileName}</p>
    </a>
  );
};

export default FileMessage;
