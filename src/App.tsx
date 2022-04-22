import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import "./exports.d";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import React from "react";
/* Theme variables */
import './theme/variables.css';
import Admin from './layouts/Admin';
import './assets/css/material-dashboard-react.css';
import { Route, Redirect, Switch } from 'react-router';
import authRoute from "./auth/auth-routes.config";
import firebase from "./services/firebase/firebase.config";
import usePushNotificationsService from "./hooks/push-notifications-hooks.module";
import { handleDBChange, checkPriviledges } from "./auth/authorize-user.module";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { databaseRef } from "./services/firebase/database.module";
import { Capacitor } from "@capacitor/core";
import capacitorStorageService from "./services/storage/capacitor-storage.module";
import useJobReminder from "./hooks/jobreminderHook.module";

const App: React.FC = () => {
  const [authenticated, setIsAuthenticated] = React.useState<any>(null);
  const [called, setCalled] = React.useState<boolean>(false);
  const { registrationToken } = usePushNotificationsService();
  useJobReminder();
  // firebase.auth().signOut().then(async (res: any) => await capacitorStorageService.clearStorage())
  React.useLayoutEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      StatusBar.hide();
    }
    capacitorStorageService.get('user')
      .then((res: any) => {
        if (res && res.value) {
          const user = JSON.parse(res.value);
          setIsAuthenticated(true);
          setCalled(true)
          handleDBChange(user);
        }
        else {
          setIsAuthenticated(false);
          setCalled(true)
        }
      })
      .catch((err: any) => console.error(err));

    if (firebase && firebase.auth())
      firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          const userObject: any = {
            email: user.email || 'user' + Math.random().toString() + '@domain.com',
            displayName: user.displayName || 'moderator' + Math.random().toString(),
            isActive: true,
            isAdmin: false,
            photoURL: user.photoURL || "/assets/img/avatar_12.png",
            registrationToken: registrationToken ? registrationToken : '',
            phoneNo: user.phoneNumber || '',
          };
          setIsAuthenticated(true);
          setCalled(true);
          handleDBChange(userObject)
        } else {
          setIsAuthenticated(false);
          capacitorStorageService.clearStorage()
        }
      })
  }, []);

  React.useLayoutEffect(() => {
    called && Capacitor.getPlatform() !== 'web' && authenticated !== null && SplashScreen.hide();
  }, [called]);

  function checkUserPriviledge() {
    return capacitorStorageService.get('user')
      .then((res: any) => {
        if (res && res.value) {
          const user = JSON.parse(res.value);
          checkPriviledges({ ...user });
        }
      })
      .catch((err: any) => console.error(err));
  }

  // check user priviledges
  React.useLayoutEffect(() => {
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

  return (
    <IonApp>
      <IonReactRouter>
        {/* ion route will render here */}
        <Switch>
          {/* render auth routes if user is not authenticated */}
          {
            authenticated ? (
              <>
                <Route path="/admin" component={Admin} />
                <Redirect from="/" to="/admin/home" />
              </>
            ) : authenticated === false && (
              <>
                <Route
                  path={authRoute.path}
                  component={authRoute.component}
                  exact={authRoute.exact}
                />
                <Redirect from="/" to="/signin" />
              </>
            )
          }
        </Switch>
      </IonReactRouter>
    </IonApp >
  )
};

export default App;