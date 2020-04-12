import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Button } from "@material-ui/core";
import { Table, Row } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

import NotificationSystem from "react-notification-system";
import { style } from "../variables/Variables";

const thArr = ["ID", "Date", "Start", "End", "Actions"]; // Table Headers
const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

// Initializing time variables
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day
tomorrow.setHours(9); // Set to opening time of clinic
tomorrow.setMinutes(0);

export default class EditApts extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.state = {
      doctorName: "",
      fname: "",
      lname: "",
      date: tomorrow,
      start: tomorrow,
      end: tomorrow,
      availableApts: [],
      _notificationSystem: null,
    };
  }

  handleChange = (name) => (e) => {
    this.setState({ [name]: e });
  };

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

  addAvailability = (e) => {
    e.preventDefault();
    const { date, start, end } = e.target.elements;
    const cont = this.context;

    const st = date.value + " " + start.value;
    const ed = date.value + " " + end.value;

    let start_t = +new Date(st);
    let end_t = +new Date(ed);

    let start_ts = Math.floor(start_t / 1000);
    let end_ts = Math.floor(end_t / 1000);

    // Check if the doctor already has an availability that day
    for (let i = 0; i < this.state.availableApts.length; i++) {
      if (date.value === this.state.availableApts[i][1]) {
        this.handleAlert(
          "tc",
          "error",
          "Already have an availability for that day!"
        );
        return;
        // return alert("Already have an availability for that day!");
      }
    }

    // Check if end time is less than start time
    if (end_ts <= start_ts) {
      this.handleAlert(
        "tc",
        "error",
        "Start time cannot be greater than end time"
      );
      return;
      // return alert("Start time cannot be greater than end time");
    }

    // Check if the day is a weekend
    const when = new Date(st);
    const day = when.getDay();
    if (day === 0 || day === 6) {
      this.handleAlert("tc", "error", "Cannot Work on a weekend!");
      return;
      // return alert("Cannot Work on a weekend!");
    }

    // Cut the time range into hour time slots
    let start_point = start_ts;
    let end_point = start_ts + 3600;

    while (start_point < end_ts) {
      console.log("start pointer: " + start_point, "end pointer: " + end_point);

      db.collection("Appointment")
        .add({
          docName: this.state.doctorName,
          doctorID: cont.currentUser.uid,
          end: new Date(end_point * 1000),
          patientID: "",
          start: new Date(start_point * 1000),
          status: "open",
          title: "Open Appointment",
        })
        .then((ref) => {
          const apt = [
            ref.id,
            months[when.getMonth()] +
              "/" +
              when.getDate() +
              "/" +
              when.getFullYear(),
            start.value,
            end.value,
          ];
          this.setState({
            availableApts: this.state.availableApts.concat([apt]),
          });
        });

      start_point += 3600;
      end_point += 3600;
    }

    this.handleAlert("tc", "success", "Successfully added availability!");
  };

  deleteApt = (i) => {
    console.log(this.state.availableApts);
    console.log(this.state.availableApts[i][0]);

    db.collection("Appointment")
      .doc(this.state.availableApts[i][0])
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });

    this.setState((state) => ({
      availableApts: state.availableApts.filter((row, j) => j !== i),
    }));
  };

  getAvailableApts() {
    const cont = this.context;
    const apts = [];
    db.collection("Appointment")
      .where("doctorID", "==", cont.currentUser.uid)
      .where("status", "==", "open")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const apt = [];

          const start = new Date(doc.data().start.seconds * 1000);
          const end = new Date(doc.data().end.seconds * 1000);

          const date =
            months[start.getMonth()] +
            "/" +
            start.getDate() +
            "/" +
            start.getFullYear();

          const st = start.getHours() + ":" + start.getMinutes() + "0";
          const ed = end.getHours() + ":" + end.getMinutes() + "0";

          const id = doc.id;

          apt.push(id);
          apt.push(date);
          apt.push(st);
          apt.push(ed);

          apts.push(apt);
        });
      })
      .then(() => {
        this.setState({ availableApts: apts });
        console.log(this.state.availableApts);
      });
  }

  componentDidMount() {
    this.getAvailableApts(); // Get all available appointments for doctor

    this.setState({ _notificationSystem: this.refs.notificationSystem });

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
            doctorName: doc.data().fname + " " + doc.data().lname,
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="content" style={{ paddingTop: 50, height: "100vh" }}>
        <Grid
          container
          cols={1}
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Row>
            <Card
              title="Add Availability"
              content={
                <form onSubmit={this.addAvailability}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      name="date"
                      size="medium"
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date"
                      minDate={tomorrow}
                      value={this.state.date}
                      onChange={this.handleChange("date")}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                    <KeyboardTimePicker
                      minutesStep={60}
                      name="start"
                      variant="inline"
                      size="medium"
                      margin="normal"
                      id="time-picker"
                      label="Start Time"
                      views={["hours"]}
                      value={this.state.start}
                      onChange={this.handleChange("start")}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                    <KeyboardTimePicker
                      minutesStep={60}
                      name="end"
                      variant="inline"
                      size="medium"
                      margin="normal"
                      id="time-picker"
                      label="End Time"
                      views={["hours"]}
                      value={this.state.end}
                      onChange={this.handleChange("end")}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <Button
                    className="col-md-3 pull-right"
                    variant="outlined"
                    type="submit"
                    primary={true}
                  >
                    Add
                  </Button>
                </form>
              }
            />
            <Card
              title="Open Appointment Slots"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover>
                  <thead variant="dark">
                    <tr>
                      {thArr.map((prop, key) => {
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.availableApts.map((apt, index) => {
                      return (
                        <tr key={index}>
                          {apt.map((apt, index) => {
                            return <td key={index}>{apt}</td>;
                          })}
                          <td>
                            <Button
                              className="col-md-3 pull-right"
                              variant="outlined"
                              primary={true}
                              onClick={this.deleteApt.bind(this, index)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              }
            />
          </Row>
        </Grid>
        <NotificationSystem ref="notificationSystem" style={style} />
      </div>
    );
  }
}
