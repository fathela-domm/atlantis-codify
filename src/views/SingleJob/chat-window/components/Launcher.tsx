import React, { Component } from 'react';
import ChatWindow from './ChatWindow';
import launcherIcon from './../assets/logo-no-bg.svg';
import incomingMessageSound from '../assets/sounds/notification.mp3';
import launcherIconActive from './../assets/close-icon.png';

interface LauncherProps {
  onMessageWasReceived?: Function;
  onMessageWasSent?: Function;
  newMessagesCount?: number;
  isOpen?: boolean;
  handleClick?: Function;
  messageList?: any;
  mute?: boolean;
  onFilesSelected?: Function;
  agentProfile?: any;
  showEmoji?: boolean;
  showFileIcon?: boolean;
};

class Launcher extends Component<LauncherProps, any> {

  constructor(props: LauncherProps) {
    super(props);
    this.state = {
      launcherIcon,
      isOpen: false
    };
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.mute) { return; }
    const nextMessage = nextProps.messageList[nextProps.messageList.length - 1];
    const isIncoming = (nextMessage || {}).author === 'them';
    const isNew = nextProps.messageList.length > this.props.messageList.length;
    if (isIncoming && isNew) {
      this.playIncomingMessageSound();
    }
  }

  playIncomingMessageSound() {
    var audio = new Audio(incomingMessageSound);
    audio.play();
  }

  handleClick() {
    if (this.props.handleClick !== undefined) {
      this.props.handleClick();
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }
  render() {
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;
    const classList = [
      'sc-launcher',
      (isOpen ? 'opened' : ''),
    ];
    return (
      <div id="sc-launcher">
        <div className={classList.join(' ')} onClick={this.handleClick.bind(this)}>
          <MessageCount count={this.props.newMessagesCount || 0} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          <img className={'sc-closed-icon'} src={launcherIcon} />
        </div>
        <ChatWindow
          messageList={this.props.messageList}
          onUserInputSubmit={this.props.onMessageWasSent}
          onFilesSelected={this.props.onFilesSelected}
          agentProfile={this.props.agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={this.props.showEmoji || true}
        />
      </div>
    );
  }
}

interface MessageCountProps {
  isOpen: boolean;
  count: number;
}

const MessageCount = (props: MessageCountProps) => {
  if (props.count === 0 || props.isOpen === true) { return null; }
  return (
    <div className={'sc-new-messages-count'}>
      {props.count}
    </div>
  );
};

export default Launcher;
