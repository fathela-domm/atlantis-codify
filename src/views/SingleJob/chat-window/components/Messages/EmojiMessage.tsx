import React from 'react';

interface EmojiMessageProps {
  data?: any;
}

const EmojiMessage = (props: EmojiMessageProps) => {
  return <div className="sc-message--emoji">{props.data.emoji}</div>;
};

export default EmojiMessage;
