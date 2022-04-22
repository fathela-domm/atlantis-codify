import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Notifications from '@material-ui/icons/Notifications';
import Dashboard from '@material-ui/icons/Dashboard';
import Search from '@material-ui/icons/Search';
// core components
import CustomInput from '../CustomInput/CustomInput';
import Button from '../CustomButtons/Button';

import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';

interface Props {
  classes: any;
}

class HeaderLinks extends React.Component<Props, {}> {

  anchorEl: any;

  state = {
    open: false
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  handleClose = (event: any) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp={true} implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
        <div className={classes.manager}>
          <Button
            buttonRef={(node: any) => {
              this.anchorEl = node;
            }}
            color={window.innerWidth > 959 ? 'transparent' : 'white'}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className={classes.buttonLink}
          >
            <Notifications className={classes.icons} />
            {/* render the notifications length here */}
            {/* <span className={classes.notifications}>5</span> */}
            <Hidden mdUp={true} implementation="css">
              <p className={classes.linkText}>
                {/* onClick={this.handleClick} */}
                Notification
              </p>
            </Hidden>
          </Button>
        </div>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Person"
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp={true} implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
