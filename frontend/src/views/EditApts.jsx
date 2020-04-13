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
]; // 2 digit representation of the monhts

// Initializing time variables
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day
tomorrow.setHours(9); // Set to opening time of clinic as 9 am
tomorrow.setMinutes(0);

/**
 * View page where doctors can add, edit, and delete
 * current open appointments they currently have
 *
 * @author Justin Flores
 */
export default class EditApts extends Component {
  static contextType = AuthContext; // Context used for

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this); //
    this.handleAlert = this.handleAlert.bind(this); // Bind the alert
    this.state = {
      doctorName: "", // name of doctor
      fname: "", // first name of doctor
      lname: "", // last name of doctor
      date: tomorrow, // chosen date
      start: tomorrow, // chosen start time
      end: tomorrow, // chosen end time
      availableApts: [], // All available appointments for the doctor
      _notificationSystem: null,
    };
  }

  /**
   * Change a state variable when user changes content
   * in input fields
   *
   * @param {string} name of state field to be modified
   * @param {event object} e an html element representing an input field
   */
  handleChange = (name) => (e) => {
    this.setState({ [name]: e });
  };

  /**
   * Show an alert after the user add an new availability
   *
   * @param {string} position where the alert is pop-up
   * @param {string} level    the type of alert
   * @param {string} message  message in  the aler
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
   *
   * @param {event object} e an html element representing an input field
   */
  addAvailability = (e) => {
    e.preventDefault();
    const { date, start, end } = e.target.elements;
    const cont = this.context;

    const st = date.value + " " + start.value;
    const ed = date.value + " " + end.value;

    let start_t = +new Date(st);
    let end_t = +new Date(ed);

    let sameDate = false;

    /**
     *  Check if the doctor already has an appointment for that day
     *  so that it will check of the new hour slots will overlap
     *  with the current ones
     */
    for (let i = 0; i < this.state.availableApts.length; i++) {
      if (date.value === this.state.availableApts[i][1]) sameDate = true;
    }

    // Check if end time is less than start time
    if (end_t <= start_t) {
      this.handleAlert(
        "tc",
        "error",
        "End time cannot be before or the same time as start time"
      );
      return;
    }

    // Check if the day is a weekend
    const when = new Date(st);
    const day = when.getDay();
    if (day === 0 || day === 6) {
      this.handleAlert("tc", "error", "Cannot Work on a weekend!");
      return;
    }

    // Cut the time range into hour time slots and add them to the DB as open appointments
    let start_point = start_t;
    let end_point = start_t + 3600000;

    while (start_point < end_t) {
      let add = true;
      console.log("start pointer: " + start_point, "end pointer: " + end_point);
      if (sameDate) {
        // Check for other overlapping appointment slots
        for (let i = 0; i < this.state.availableApts.length; i++) {
          if (date.value === this.state.availableApts[i][1]) {
            let temp1 = +new Date(
              this.state.availableApts[i][1] +
                " " +
                this.state.availableApts[i][2]
            );
            let temp2 = +new Date(
              this.state.availableApts[i][1] +
                " " +
                this.state.availableApts[i][3]
            );

            if (start_point === temp1 && end_point === temp2) {
              add = false;
              console.log("Could not add this");
            }
          }
        }
      }

      // Adding new hour slot to the database
      if (add) {
        console.log("Added this");
        const new_start = new Date(start_point);
        const new_end = new Date(end_point);
        db.collection("Appointment")
          .add({
            docName: this.state.doctorName,
            doctorID: cont.currentUser.uid,
            end: new_end,
            patientID: "",
            start: new_start,
            status: "open",
            title: "Open Appointment",
          })
          .then((ref) => {
            // Add new hour slots to the table by updating state variable
            const apt = [
              ref.id,
              months[new_start.getMonth()] +
                "/" +
                new_start.getDate() +
                "/" +
                new_start.getFullYear(),
              new_start.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
              new_end.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
            ];
            this.setState({
              availableApts: this.state.availableApts.concat([apt]),
            });
          });
      }
      start_point += 3600000;
      end_point += 3600000;
    }

    this.handleAlert("tc", "success", "Successfully added availability!");
  };

  /**
   * Delete appointment from the DB and remove it
   * from the table
   *
   * @param {int} i the index of the appointment to be deleted
   */
  deleteApt = (i) => {
    console.log(this.state.availableApts);
    console.log(this.state.availableApts[i][0]);

    // Remove from the DB
    db.collection("Appointment")
      .doc(this.state.availableApts[i][0])
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });

    // Remove from the table
    this.setState((state) => ({
      availableApts: state.availableApts.filter((row, j) => j !== i),
    }));
  };

  /**
   * Get all open appointment slots for the doctor
   */
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

          const st = start.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          const ed = end.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

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

    this.setState({ _notificationSystem: this.refs.notificationSystem }); // Initialize the notification system

    const cont = this.context;
    // Retrieve the full name ofthe doctor
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
        <NotificationSystem ref="notificationSystem" style={style} />
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
      </div>
    );
  }
}
