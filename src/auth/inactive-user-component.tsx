import React from "react";
import Typography from "@material-ui/core/Typography";

export default function UnauthenticatedUserComponent() {
    return (
        <Typography color="error" style={{ textAlign: "left", fontSize: '18px' }}>
            Your account is locked.<br />
            Wait for account activation or contact the admin for authorization.
        </Typography>
    )
}
