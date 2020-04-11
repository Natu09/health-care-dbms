import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import { UserCard } from "components/UserCard/UserCard.jsx";

import avatar from "assets/img/faces/face-3.jpg";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

class UserProfile extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      color: "red",
      hasImage: true,
      fname: "",
      lname: "",
      email: "",
      name: "",
    };
  }

  componentDidMount() {
    const cont = this.context;

    // Get the user lastname and set the sate of user lastname
    try {
      db.collection("Users")
        .doc(cont.currentUser.uid)
        .get()
        .then((doc) => {
          this.setState({
            fname: doc.data().fname,
            lname: doc.data().lname,
            name: doc.data().fname + " " + doc.data().lname,
            email: doc.data().email,
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="content" style={{ paddingTop: 50 }}>
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-8"]}
                      properties={[
                        {
                          label: "Email address",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          defaultValue:
                            this.state.email !== null ? this.state.email : "",
                          disabled: this.state.email !== null,
                        },
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-8"]}
                      properties={[
                        {
                          label: "Name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Name",
                          defaultValue:
                            this.state.nname !== null ? this.state.name : "",
                          disabled: this.state.name !== null,
                        },
                      ]}
                    />
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name={this.state.fname + " " + this.state.lname}
                userName={this.state.email.toLowerCase().split("@")[0]}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
