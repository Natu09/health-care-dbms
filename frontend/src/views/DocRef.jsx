import React, { Component } from "react";

import {
  Grid,
  Row,
  Col,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Table,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
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
      patients: [],
      doctors: [],
      patient: "",
      doctor: "",
      test: "Blood Test",
      docRefs: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const cont = this.context;

    db.collection("Reference").add({
      fromDoctorID: cont.currentUser.uid,
      patientID: this.state.patient,
      toDoctorID: this.state.doctor,
      type: this.state.test,
    });
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
          pat.fname = doc.data().fname;
          pat.lname = doc.data().lname;
          pat.fullName = pat.fname + " " + pat.lname;

          arr.push(pat);
        });
      })
      .then(() => {
        this.setState({ patients: arr });
        this.setState({
          patient: this.state.patients[0].id,
        });
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
          doctor.fname = doc.data().fname;
          doctor.lname = doc.data().lname;

          arr.push(doctor);
        });
      })
      .then(() => {
        this.setState({ doctors: arr });
        this.setState({
          doctor: this.state.doctors[0].id,
        });
        console.log(this.state.doctors);
      });
  }

  getReferrences() {
    const cont = this.context;
    const refs = [];
    db.collection("Reference")
      .where("fromDoctorID", "==", cont.currentUser.uid)
      .get()
      .then((res) => {
        res.forEach((ref) => {
          refs.push(ref.data());
        });
      })
      .then((_) => {
        this.setState({ docRefs: refs });
      });
  }

  componentDidMount() {
    this.getPatients();
    this.getDoctors();
    this.getReferrences();
  }

  render() {
    return (
      <div
        className="content"
        style={{
          paddingTop: 50,
          height: "100vh",
        }}
      >
        <Grid container direction="row" justify="center" alignItems="center">
          <Row>
            <Card
              title="Refer Patient"
              content={
                <Grid fluid>
                  <form onSubmit={this.handleSubmit}>
                    <Row>
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Patient</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          value={this.state.patient}
                          onChange={this.handleChange.bind(this, "patient")}
                        >
                          {this.state.patients.map((pat, _) => {
                            return (
                              <option value={pat.id}>{pat.fullName}</option>
                            );
                          })}
                        </FormControl>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Doctor</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          value={this.state.doctor}
                          onChange={this.handleChange.bind(this, "doctor")}
                        >
                          {this.state.doctors.map((doc, _) => {
                            return <option value={doc.id}>{doc.lname}</option>;
                          })}
                        </FormControl>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Test</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          value={this.state.test}
                          onChange={this.handleChange.bind(this, "test")}
                        >
                          <option value="Blood Test">Blood Test</option>
                          <option value="X-Ray Scan">X-Ray Scan</option>
                          <option value="Eye Test">Eye Test</option>
                          <option value="Bone Scan">Bone Scan</option>
                        </FormControl>
                      </FormGroup>
                    </Row>
                    <Row>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Row>
                  </form>
                </Grid>
              }
            />
          </Row>
          <Row>
            <Card
              title="Partien References"
              content={
                <Table>
                  <thead variant="dark">
                    <tr>
                      <th>Patient ID</th>
                      <th>Doctor ID</th>
                      <th>Test</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.docRefs.map((ref, key) => {
                      return (
                        <tr key={key}>
                          <td key={key}>{ref.patientID}</td>
                          <td key={key}>{ref.toDoctorID}</td>
                          <td key={key}>{ref.type}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              }
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default DocRef;
