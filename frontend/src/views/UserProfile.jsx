/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends Component {
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
          <Row>
            <Card
              title="Already have an account? Sign in here"
              content={
                <form>
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
                        label: "Password",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "1234"
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
    );
  }
}

export default UserProfile;
