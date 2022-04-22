import React from 'react';
import firebase, { uiConfig } from "../services/firebase/firebase.config";
import "./signin-component.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Typography from "@material-ui/core/Typography";

export default function SignInForm() {
    return (
        <>
            {/* <Typography variant='h3'>Welcome</Typography>
            <Typography color="error" style={{ textAlign: "center", fontSize: '18px', width: '100%' }}>
                Thank you for agreeing to create an account with us today.
                <br />
                Click on one of the buttons below to continue.
            </Typography> */}
            <div className='siginform-firebasui'>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        </>
    );
}