import React, {useCallback, useContext} from 'react';
import { withRouter, Redirect } from 'react-router';
import app from "../firebase"
import { AuthContext} from '../Auth'


import { Grid, Row } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { createEventInstance } from '@fullcalendar/core';



const LogIn = ({ history }) => {
    const handleLogin = useCallback(
        async event => {
            event.preventDefault()
            const { email, password } = event.target.elements
            try {
                await app.auth().signInWithEmailAndPassword(email.value, password.value)
                history.push("/")
            } catch (error) {
                alert(error)
            }
        },
        [history],
    )

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />
    }

    return (
        <div className="content">
        <Grid fluid>
            <Row>
            <Card
                title="Log In"
                content={
                <form onSubmit={ handleLogin }>
                    <FormInputs
                    ncols={["col-md-12"]}
                    properties={[
                        {
                        label: "Email Address",
                        type: "email",
                        bsClass: "form-control",
                        placeholder: "firstname.lastname@ahs.ca"
                        }
                    ]}
                    />
                    <FormInputs
                    ncols={["col-md-12"]}
                    properties={[
                        {
                        label: "Password",
                        type: "password",
                        bsClass: "form-control",
                        placeholder: "Password"
                        }
                    ]}
                    />
                    <Button bsStyle="info" pullRight fill type="submit">
                    Log in
                    </Button>
                    <div className="clearfix" />
                </form>
                }
            />
            </Row>
        </Grid>
        </div>
    )
}

export default withRouter(LogIn);



