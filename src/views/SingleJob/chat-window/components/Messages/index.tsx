import React, { Component } from 'react';
import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';
import FileMessage from './FileMessage';
import chatIconUrl from './../../assets/chat-icon.svg';

interface MessageProps {
  message: any;
}

class Message extends Component<MessageProps> {
  constructor(props: MessageProps) {
    super(props)
    this._renderMessageOfType = this._renderMessageOfType.bind(this)
  }


  _renderMessageOfType(type: any) {
    switch (type) {
      case 'text':
        return <TextMessage {...this.props.message} />;
      case 'emoji':
        return <EmojiMessage {...this.props.message} />;
      case 'file':
        return <FileMessage {...this.props.message} />;
      default:
        console.error(`Attempting to load message with unsupported file type '${type}'`);
    }
  }

  render() {
    let contentClassList = [
      'sc-message--content',
      (this.props.message.author === 'me' ? 'sent' : 'received')
    ];
    return (
      <div className="sc-message">
        <div className={contentClassList.join(' ')}>
          {this._renderMessageOfType(this.props.message.type)}
        </div>
      </div>);
  }
}

export default Message;
