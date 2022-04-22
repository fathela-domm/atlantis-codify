import React, { Component } from 'react';

interface PopupWindowProps {
  isOpen?: any;
  children?: any;
  onClickedOutside?: any;
  onInputChange?: any;
}

class PopupWindow extends Component<PopupWindowProps> {
  scLauncher = document.querySelector('#sc-launcher');
  emojiPopup: any;
  constructor(props: PopupWindowProps) {
    super(props);
    this.interceptLauncherClick = this.interceptLauncherClick.bind(this);
  }
  componentDidMount() {
    this.scLauncher && this.scLauncher.addEventListener('click', this.interceptLauncherClick);
  }

  componentWillUnmount() {
    this.scLauncher && this.scLauncher.removeEventListener('click', this.interceptLauncherClick);
  }

  interceptLauncherClick = (e: any) => {
    const { isOpen } = this.props;
    const clickedOutside = !this.emojiPopup.contains(e.target) && isOpen;
    clickedOutside && this.props.onClickedOutside(e);
  }

  render() {
    const { isOpen, children } = this.props;
    return (
      <div className="sc-popup-window" ref={(e: any) => this.emojiPopup = e}>
        <div className={`sc-popup-window--cointainer ${isOpen ? '' : 'closed'}`}>
          <input
            onChange={this.props.onInputChange}
            className="sc-popup-window--search"
            placeholder="Search emoji..."
          />
          {children}
        </div>
      </div>
    );
  }
}

export default PopupWindow;
