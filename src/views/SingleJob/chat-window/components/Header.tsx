import React, { Component } from 'react';
import closeIcon from './../assets/close-icon.png';

interface HeaderProps{
  imageUrl?: any;
  teamName?: any;
  onClose?: any;
}

class Header extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }
  render() {
    return (
      <div className="sc-header">
        <img className="sc-header--img" src={this.props.imageUrl} alt="" />
        <div className="sc-header--team-name"> {this.props.teamName} </div>
        <div className="sc-header--close-button" onClick={this.props.onClose}>
          <img src={closeIcon} alt="" />
        </div>
      </div>
    );
  }
}

export default Header;
