import React, { Component } from 'react'

import { Grid, Row } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

class SignUp extends Component {
    render() {
        return (
            <div className="content">
            <Grid fluid>
                <Row>
                <Card
                    title="Sign Up"
                    content={
                    <form>
                        <FormInputs
                        ncols={["col-md-6", "col-md-6"]}
                        properties={[
                            {
                            label: "First name",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "First name"
                            },
                            {
                            label: "Last name",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "Last name"
                            }
                        ]}
                        />
                        <FormInputs
                        ncols={["col-md-12"]}
                        properties={[
                            {
                            label: "Email Address",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "firstname.lastname@ahs.ca"
                            }
                        ]}
                        />
                        <FormInputs
                        ncols={["col-md-12"]}
                        properties={[
                            {
                            label: "Enter a Password",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "1234"
                            }
                        ]}
                        />
                        <FormInputs
                        ncols={["col-md-12"]}
                        properties={[
                            {
                            label: "Re-enter your Password",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "1234"
                            }
                        ]}
                        />
                        <Button bsStyle="info" pullRight fill type="submit">
                        Register
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
}

export default SignUp
