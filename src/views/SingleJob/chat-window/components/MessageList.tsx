import React, { Component } from 'react';
import Message from './Messages';

interface MessageListProps {
  messages?: any;
  imageUrl?: any;
}

class MessageList extends Component<MessageListProps> {
  scrollList: any;
  constructor(props: MessageListProps) {
    super(props)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }


  componentDidUpdate(_prevProps: any, _prevState: any) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight;
  }

  render() {
    return (
      <div className="sc-message-list" ref={(el: any) => this.scrollList = el}>
        {this.props.messages.map((message: any, i: number) => {
          return <Message message={message} key={i} />;
        })}
      </div>);
  }
}

export default MessageList;
