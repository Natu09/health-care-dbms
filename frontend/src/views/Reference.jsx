import React, { Component } from "react";

import { Card } from "components/Card/Card.jsx";
import { Grid } from "@material-ui/core";

import { Table } from "react-bootstrap";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

const thArr = [
  "ID",
  "Type",
  "Referred By",
  "Referred To",
  "Select Appointment Date",
];

export default class Referals extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      referals: [],
      open: false,
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("Your favorite flavor is: " + this.state.value);
    event.preventDefault();
  }

  getReference() {
    const cont = this.context;
    const arr = [];
    db.collection("Reference")
      .where("patientID", "==", cont.currentUser.uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const ref = doc.data();

          ref.id = doc.id;
          ref.fromDocName = doc.data().fromDoctorName;
          ref.fromDoctorID = doc.data().fromDoctorID;
          ref.toDocName = doc.data().toDoctorName;
          ref.toDoctorID = doc.data().toDoctorID;
          ref.patientID = doc.data().patientID;
          ref.type = doc.data().type;

          const apts = [];

          db.collection("Appointment")
            .where("doctorID", "==", doc.data().toDoctorID)
            .where("status", "==", "open")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach((doc2) => {
                const events = doc2.data();

                events.id = doc2.id;
                events.start = doc2.data().start;
                events.end = doc2.data().start;
                events.status = doc2.data().status;

                apts.push(events);
              });
            })
            .then(() => {});

          ref.apts = apts;

          arr.push(ref);
          // console.log(ref);
        });
      })
      .then(() => {
        this.setState({ referals: arr });
        // console.log(this.state.referals);
      });
  }

  componentDidMount() {
    this.getReference();
    // this.getAvailableApts();

    // const cont = this.context;

    // Get the user lastname and set the sate of user lastname
    // try {
    //   db.collection("Users")
    //     .doc(cont.currentUser.uid)
    //     .get()
    //     .then((doc) => {
    //       this.setState({
    //         fname: doc.data().,
    //         lname: doc.data().,
    //         doctorName: doc.data().
    //       });
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    return (
      <div style={{ paddingTop: 50 }}>
        <Grid
          container
          cols={1}
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Card
            title="Doctor Referrals"
            content={
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {thArr.map((prop, key) => {
                      return <th key={key}>{prop}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.referals.map((refs, index) => {
                    return (
                      <tr key={index}>
                        <td> {refs.id} </td>
                        <td> {refs.type} </td>
                        <td> {refs.fromDocName} </td>
                        <td> {refs.toDocName} </td>
                        <td>
                          <form onSubmit={this.handleSubmit}>
                            <label>
                              Pick your preffered test date:
                              <select
                                value={this.state.value}
                                onChange={this.handleChange}
                              >
                                {console.log(refs.apts)}
                                <option value="lime">Lime</option>
                                {refs.apts.forEach((a) => {
                                  console.log(a);
                                })}

                                {/* <option value="grapefruit">Grapefruit</option>
                                <option value="lime">Lime</option>
                                <option value="coconut">Coconut</option>
                                <option value="mango">Mango</option> */}
                              </select>
                            </label>
                            <input type="submit" value="Submit" />
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            }
          />
        </Grid>
      </div>
    );
  }
}
