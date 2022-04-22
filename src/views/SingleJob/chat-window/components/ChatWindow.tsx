import React, { Component } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';

interface ChatWindowProps {
  agentProfile: any;
  isOpen: any,
  onClose: any,
  onFilesSelected: any,
  onUserInputSubmit: any,
  showEmoji: boolean,
  messageList: any,
};


class ChatWindow extends Component<ChatWindowProps> {
  constructor(props: ChatWindowProps) {
    super(props);
    this.onUserInputSubmit = this.onUserInputSubmit.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
  }

  onUserInputSubmit(message: any) {
    this.props.onUserInputSubmit(message);
  }

  onFilesSelected(filesList: any) {
    this.props.onFilesSelected(filesList);
  }

  render() {
    let messageList = this.props.messageList || [];
    let classList = [
      'sc-chat-window',
      (this.props.isOpen ? 'opened' : 'closed')
    ];
    return (
      <div className={classList.join(' ')}>
        <Header
          teamName={this.props.agentProfile.teamName}
          imageUrl={this.props.agentProfile.imageUrl}
          onClose={this.props.onClose}
        />
        <MessageList
          messages={messageList}
          imageUrl={this.props.agentProfile.imageUrl}
        />
        <UserInput
          onSubmit={this.onUserInputSubmit.bind(this)}
          onFilesSelected={this.onFilesSelected.bind(this)}
          showEmoji={this.props.showEmoji}
        />
      </div>
    );
  }
}
export default ChatWindow;
