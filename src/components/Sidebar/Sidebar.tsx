import React from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
// core components
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Menu from '@material-ui/icons/Menu';
// import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';
import RTLNavbarLinks from '../Navbars/RTLNavbarLinks';
import { IonText, IonTitle } from "@ionic/react";
import { Link } from "react-router-dom";
import sidebarStyle from '../../assets/jss/material-dashboard-react/components/sidebarStyle';
import capacitorStorageService from "../../services/storage/capacitor-storage.module";
import useIsMounted from '../../hooks/ismounted-hook.module';
import { databaseRef } from '../../services/firebase/database.module';
import { checkPriviledges } from '../../auth/authorize-user.module';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName: any) {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }
  const { classes, color, logo, image, logoText, routes } = props;
  const isMounted = useIsMounted();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  function checkUserPriviledge() {
    capacitorStorageService.create("developer", "domm mbugua").then((res: any) => {
      capacitorStorageService.get('user')
        .then((res: any) => {
          if (res && res.value) {
            const user = JSON.parse(res.value);
            setCurrentUser(user)
            checkPriviledges(user);
          }
        })
        .catch((err: any) => console.error(err));
    })
  }
  React.useEffect(() => {
    isMounted.current && checkUserPriviledge();
    databaseRef.on("child_added", (snapshot: any) => {
      checkUserPriviledge();
    });

    databaseRef.on("child_changed", (snapshot: any) => {
      checkUserPriviledge();
    });

    databaseRef.on("child_removed", (snapshot: any) => {
      checkUserPriviledge();
    });
    databaseRef.on("child_moved", (snapshot: any) => {
      checkUserPriviledge();
    });
  }, []);

  React.useLayoutEffect(() => {
    capacitorStorageService.get('user')
      .then((res: any) => {
        res && res.value && setCurrentUser(JSON.parse(res.value));
      })
      .catch((err: any) => console.error(err));
  }, []);
  var links = (
    <List className={classes.list}>
      {routes.map((prop: any, key: any) => {
        var activePro = ' ';
        var listItemClasses;
        if (prop.path === '/upgrade-to-pro') {
          activePro = classes.activePro + ' ';
          listItemClasses = classNames({
            [' ' + classes[color]]: true
          });
        }
        else {
          listItemClasses = classNames({
            [' ' + classes[color]]: activeRoute(prop.layout + prop.path)
          });
        }
        const whiteFontClasses = classNames({
          [' ' + classes.whiteFont]: activeRoute(prop.layout + prop.path)
        });
        if (!currentUser) {
          return (prop.name !== "Moderators" && prop.name !== 'Single Job' && prop.name !== "Admins") && (<NavLink
            to={prop.layout + prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button={true} className={classes.itemLink + listItemClasses}>
              {
                typeof prop.icon === 'string' ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  />
                )}
              {
                <ListItemText
                  primary={
                    props.rtlActive ? prop.rtlName : prop.name
                  }
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive
                  })}
                  disableTypography={true}
                />
              }
            </ListItem>
          </NavLink>)
        }
        if (currentUser && !currentUser.isAdmin) {
          return (prop.name !== "Moderators" && prop.name !== 'Single Job' && prop.name !== "Admins") && (<NavLink
            to={prop.layout + prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button={true} className={classes.itemLink + listItemClasses}>
              {
                typeof prop.icon === 'string' ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  />
                )}
              {
                <ListItemText
                  primary={
                    props.rtlActive ? prop.rtlName : prop.name
                  }
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive
                  })}
                  disableTypography={true}
                />
              }
            </ListItem>
          </NavLink>)
        }
        else
          return prop.name !== 'Single Job' && (
            <NavLink
              to={prop.layout + prop.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button={true} className={classes.itemLink + listItemClasses}>
                {
                  typeof prop.icon === 'string' ? (
                    <Icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses, {
                        [classes.itemIconRTL]: props.rtlActive
                      })}
                    />
                  )}
                {
                  <ListItemText
                    primary={
                      props.rtlActive ? prop.rtlName : prop.name
                    }
                    className={classNames(classes.itemText, whiteFontClasses, {
                      [classes.itemTextRTL]: props.rtlActive
                    })}
                    disableTypography={true}
                  />
                }
              </ListItem>
            </NavLink>
          );
      })}
    </List>
  );
  var brand = (
    <div
      className={classes.logo}
      style={{
        color: "ivory",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
      <>
        <Link
          to="/admin/home"
        >
          <IonText
            className={classNames(classes.logoLink, {
              [classes.logoLinkRTL]: props.rtlActive
            })}
            style={{
              display: "flex",
              marginLeft: "5px"
            }}
          >
            <div className={classes.logoImage}>
              <img src={logo} alt="logo" className={classes.img} />
            </div>
            <IonTitle className={classNames(classes.logoLink, {
              [classes.logoLinkRTL]: props.rtlActive
            })}
            >
              {logoText}
            </IonTitle>
          </IonText>
        </Link>
      </>
      {
        <div
          className="sidebar-hamburger-toggler"
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </div>
      }
    </div>
  );
  return (
    <div style={{
      position: "absolute", overflowX: "hidden"
    }}>
      < Hidden mdUp={true} implementation="css" >
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? 'left' : 'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <></>}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden >
      <Hidden smDown={true} implementation="css">
        <Drawer
          anchor={props.rtlActive ? 'right' : 'left'}
          variant="permanent"
          open={true}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div >
  );
};

// Sidebar.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(sidebarStyle)(Sidebar);
