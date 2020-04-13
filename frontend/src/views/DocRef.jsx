// Imports
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
import NotificationSystem from "react-notification-system";
import { style } from "../variables/Variables";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

/**
 * React component that renders the references page for
 * doctor users. Also contains the function that achieves
 * the functionality needed to give refrences and view them
 *
 * @author Justin Flores, Nathaniel Habtegergesa
 * @since 1.0
 */
export class DocRef extends Component {
  static contextType = AuthContext; // To access current user ID

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.state = {
      patients: [],
      doctors: [],
      patient: "",
      doctor: "",
      test: "Blood Test",
      docRefs: [],
      _notificationSystem: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Shows an alert to notify the user if their actions
   * were successful or not
   * @param {string} position where the notification will appear
   * @param {striing} level  success or not
   * @param {string} message Message in the alert
   */
  handleAlert(position, level, message) {
    const logo = level === "error" ? "pe-7s-attention" : "pe-7s-like2";
    const title = level === "error" ? "Oops!" : "Yay!";

    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className={logo}></span>,
      message: (
        <div>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 2,
    });
  }

  /**
   * Changes state variables when user changes options
   * in the input forms
   * @param {string} name
   * @param {event object} event
   */
  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  /**
   * Adds a refrence to the DB and add
   * the new refrence to the table
   * @param {event object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    const cont = this.context;

    // Check if patient already has that same type of reference from
    // the same doctor
    for (let i = 0; i < this.state.docRefs.length; i++) {
      if (
        this.state.test === this.state.docRefs[i].type &&
        this.state.test === this.state.docRefs[i].patientID
      ) {
        this.handleAlert("tc", "error", "Patient already has that reference!");
        return;
      }
    }

    db.collection("Reference")
      .add({
        fromDoctorID: cont.currentUser.uid,
        patientID: this.state.patient,
        toDoctorID: this.state.doctor,
        type: this.state.test,
      })
      .then((res) => {
        const new_ref = {
          id: res.id,
          patientID: this.state.patient,
          toDoctorID: this.state.doctor,
          type: this.state.test,
        };
        this.setState({ docRefs: this.state.docRefs.concat(new_ref) });
        this.handleAlert("tc", "success", "Referrence given!");
      });
  }

  /**
   * Retrieves all patients in the DB and
   * add their info in the patient state
   * variable
   */
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

  /**
   * Retrieve all doctors in the DB and
   * add them to the doctor state variable
   */
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
      .then((_) => {
        this.setState({ doctors: arr });
        this.setState({
          doctor: this.state.doctors[0].id,
        });
        console.log(this.state.doctors);
      });
  }

  /**
   * Get all refernces that the current doctor has
   * given to patients
   */
  getReferrences() {
    const cont = this.context;
    const refs = [];
    db.collection("Reference")
      .where("fromDoctorID", "==", cont.currentUser.uid)
      .get()
      .then((res) => {
        res.forEach((ref) => {
          const reference = ref.data();
          reference.id = ref.id;
          refs.push(reference);
        });
      })
      .then((_) => {
        this.setState({ docRefs: refs });
      });
  }

  componentDidMount() {
    // Initialize state variables
    this.getPatients(); // Initialize patients
    this.getDoctors(); // Initialize doctors
    this.getReferrences(); // Initialize patients

    this.setState({ _notificationSystem: this.refs.notificationSystem });
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
        <NotificationSystem ref="notificationSystem" style={style} />

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
                      <th>Reference ID</th>
                      <th>Patient ID</th>
                      <th>Doctor ID</th>
                      <th>Test</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.docRefs.map((ref, key) => {
                      return (
                        <tr key={key}>
                          <td key={key}>{ref.id}</td>
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
