import React, { Component } from "react";

import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { Table } from "react-bootstrap";
import { AuthContext } from "../Auth";
import { db } from "../firebase";

const tableHeader = [
  "Patient ID",
  "Patient Name",
  "Doctor ID",
  "Doctor Name",
  "Test Type",
];

export class DocRef extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      cont: this.cont,
      patients: [],
      doctors: [],
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
    alert("Congrats your test has been booked : " + this.state.value);
    event.preventDefault();
  }

  getPatients() {
    const arr = [];
    db.collection("Users")
      .where("role", "==", "patient")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const pat = doc.data();

          pat.id = doc.id;
          pat.email = doc.data().email;
          pat.fname = doc.data().fname;
          pat.lname = doc.data().lname;
          pat.role = doc.data().role;
          pat.patientID = doc.data().uid;

          arr.push(pat);
        });
      })
      .then(() => {
        this.setState({ patients: arr });
        console.log(this.state.patients);
      });
  }

  getDoctors() {
    const arr = [];
    db.collection("Users")
      .where("role", "==", "doctor")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const doctor = doc.data();

          doctor.id = doc.id;
          doctor.email = doc.data().email;
          doctor.fname = doc.data().fname;
          doctor.lname = doc.data().lname;
          doctor.role = doc.data().role;
          doctor.doctorID = doc.data().uid;

          arr.push(doctor);
        });
      })
      .then(() => {
        this.setState({ doctor: arr });
        console.log(this.state.doctor);
      });
  }

  componentDidMount() {
    this.getPatients();
    this.getDoctors();
  }

  render() {
    return (
      <div
        className="content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   position: "absolute",
          margin: "auto",
          paddingTop: 10,
          height: "100vh",
          //   top: 0,
          //   right: 0,
          //   bottom: 0,
          //   left: 0,
        }}
      >
        <Grid>
          <Card
            title="Referal"
            content={
              <Table hover>
                <thead>
                  {tableHeader.map((title, key) => {
                    return <th key={key}>{title}</th>;
                  })}
                </thead>
                <tbody>
                  <td> ID </td>
                  <td> Name </td>
                  <td> ID </td>
                  <td> Name </td>
                  <td>
                    <form onSubmit={this.handleSubmit}>
                      <label>
                        Pick Test Type:
                        <select
                          value={this.state.value}
                          onChange={this.handleChange}
                        >
                          <option value="Ray">X-Ray</option>
                          <option value="Blood">Blood Test</option>
                          <option value="Eye">Eye Test</option>
                          <option value="Bone">Bone Test</option>
                        </select>
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                  </td>
                </tbody>
              </Table>
            }
          />
        </Grid>
      </div>
    );
  }
}

export default DocRef;
