import React, { Component } from 'react';
import classnames from 'classnames';

import imagine1 from '../../assets/img/sidebar-1.jpg';
// import imagine1 from "assets/img/sidebar-1.jpg";
import imagine2 from '../../assets/img/sidebar-2.jpg';
import imagine3 from '../../assets/img/sidebar-3.jpg';
import imagine4 from '../../assets/img/sidebar-4.jpg';
import imagine5 from '../../assets/img/sidebar-5.jpg';
import imagine6 from '../../assets/img/sidebar-6.jpg';
import imagine7 from '../../assets/img/sidebar-7.jpg';
import imagine8 from '../../assets/img/sidebar-8.jpg';
import { SettingsApplications } from "@material-ui/icons"

interface Props {
  bgImage: any;
  rtlActive?: any;
  fixedClasses: any;
  bgColor: any;
  handleFixedClick: any;
  handleColorClick: any;
  handleImageClick: any;
}

interface State {
  classes: string;
  bg_checked: boolean;
  bgImage: any;
}

class FixedPlugin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      classes: 'dropdown',
      bg_checked: true,
      bgImage: this.props.bgImage,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.handleFixedClick();
  }
  render() {
    return (
      <div
        style={{
          marginTop: "18px",
        }}
        className={classnames('fixed-plugin', {
          'rtl-fixed-plugin': this.props.rtlActive
        })}
      >
        <div id="fixedPluginClasses" className={this.props.fixedClasses}>
          <div style={{ zoom: 1.7, borderRadius: '60px' }} onClick={this.handleClick}>
            <SettingsApplications color='secondary' />
          </div>
          <ul className="dropdown-menu" style={{
            right: "50px",
            zoom: .85,
          }}>
            <li className="header-title">SIDEBAR FILTERS</li>
            <li className="adjustments-line">
              <a className="switch-trigger">
                <div>
                  <span
                    className={
                      this.props.bgColor === 'purple'
                        ? 'badge filter badge-purple active'
                        : 'badge filter badge-purple'
                    }
                    data-color="purple"
                    onClick={() => {
                      this.props.handleColorClick('purple');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'blue'
                        ? 'badge filter badge-blue active'
                        : 'badge filter badge-blue'
                    }
                    data-color="blue"
                    onClick={() => {
                      this.props.handleColorClick('blue');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'green'
                        ? 'badge filter badge-green active'
                        : 'badge filter badge-green'
                    }
                    data-color="green"
                    onClick={() => {
                      this.props.handleColorClick('green');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'red'
                        ? 'badge filter badge-red active'
                        : 'badge filter badge-red'
                    }
                    data-color="red"
                    onClick={() => {
                      this.props.handleColorClick('red');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'orange'
                        ? 'badge filter badge-orange active'
                        : 'badge filter badge-orange'
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleColorClick('orange');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'pink'
                        ? 'badge filter badge-pink active'
                        : 'badge filter badge-pink'
                    }
                    data-color="pink"
                    onClick={() => {
                      this.props.handleColorClick('pink');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'maroon'
                        ? 'badge filter badge-maroon active'
                        : 'badge filter badge-maroon'
                    }
                    data-color="maroon"
                    onClick={() => {
                      this.props.handleColorClick('maroon');
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === 'yellow'
                        ? 'badge filter badge-yellow active'
                        : 'badge filter badge-yellow'
                    }
                    data-color="yellow"
                    onClick={() => {
                      this.props.handleColorClick('yellow');
                    }}
                  />
                </div>
              </a>
            </li>
            <li className="header-title">Images</li>
            <li className={this.state.bgImage === imagine1 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine1 });
                  this.props.handleImageClick(imagine1);
                }}
              >
                <img src={imagine1} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine2 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine2 });
                  this.props.handleImageClick(imagine2);
                }}
              >
                <img src={imagine2} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine3 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine3 });
                  this.props.handleImageClick(imagine3);
                }}
              >
                <img src={imagine3} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine4 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine4 });
                  this.props.handleImageClick(imagine4);
                }}
              >
                <img src={imagine4} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine5 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine5 });
                  this.props.handleImageClick(imagine5);
                }}
              >
                <img src={imagine5} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine6 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine6 });
                  this.props.handleImageClick(imagine6);
                }}
              >
                <img src={imagine6} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine7 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine7 });
                  this.props.handleImageClick(imagine7);
                }}
              >
                <img src={imagine7} alt="..." />
              </a>
            </li>
            <li className={this.state.bgImage === imagine8 ? 'active' : ''}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine8 });
                  this.props.handleImageClick(imagine8);
                }}
              >
                <img src={imagine8} alt="..." />
              </a>
            </li>
            <li className="adjustments-line" />
          </ul>
        </div>
      </div>
    );
  }
}

export default FixedPlugin;
