import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import 'firebase/compat/messaging';
import 'firebase/compat/firestore';
import * as firebaseui from "firebaseui";
import UserSchema from '../../auth/user-schema.module';
import { authorizeUser } from '../../auth/authorize-user.module';

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
}

firebase.initializeApp(firebaseConfig);
export const uiConfig = {
    signInFlow: 'redirect',
    // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            scopes: ['https://www.googleapis.com/auth/plus.login'],
            customParameters: { prompt: 'select_account' }
        },
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: (credentials: any) => {
            let user = credentials['user'];
            const userObject: UserSchema = {
                email: user.email || 'user' + Math.random().toString() + '@domain.com',
                displayName: user.displayName || 'moderator' + Math.random().toString(),
                isActive: true,
                isAdmin: false,
                photoURL: user.photoURL || "/assets/img/avatar_12.png",
                registrationToken: '',
            }
            authorizeUser(userObject);
            return false;
        }
    }
}
// firebase.analytics(app);
export default firebase;
export const database = firebase?.database;