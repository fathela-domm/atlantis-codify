import React from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Menu from '@material-ui/icons/Menu';
// core components
import AdminNavbarLinks from './AdminNavbarLinks';
import RTLNavbarLinks from './RTLNavbarLinks';
import { IonTitle } from "@ionic/react";
import headerStyle from '../../assets/jss/material-dashboard-react/components/headerStyle';

function Header({ ...props }: any) {
  function makeBrand() {
    var name;
    props.routes.map((prop: any, key: any) => {
      if (prop.layout + prop.path === props.location.pathname) {
        name = props.rtlActive ? prop.rtlName : prop.name;
      }
      return null;
    });
    return name;
  }
  const { classes, color, image } = props;
  const appBarClasses = classNames({
    [' ' + classes[color]]: color
  });
  return (
    <div style={{ position: "static" }}>
      <AppBar
        style={{
          color: "ivory",
          background: `url(${image})`,
          position: 'fixed',
        }}
        className={classes.appBar + appBarClasses}>
        <Toolbar style={{
          color: "ivory",
        }} className={classes.container}>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <IonTitle style={{ textAlign: "left" }}>
              {/* <Button color="transparent" className={classes.title}> */}
              {makeBrand()}
              {/* </Button> */}
            </IonTitle>
          </div>
          <Hidden smDown={true} implementation="css">
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
          </Hidden>
          <Hidden mdUp={true} implementation="css">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={props.handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    </div>
  );
}

// Header.propTypes = {
//   classes: PropTypes.object.isRequired,
//   color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger'])
// };

export default withStyles(headerStyle)(Header);
