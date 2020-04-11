import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Button } from "@material-ui/core";
import { Row } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Table } from "react-bootstrap";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

const thArr = ["Date", "Start", "End", "Actions"];

export default class EditApts extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      doctorName: "",
      fname: "",
      lname: "",
      date: new Date(),
      start: new Date(),
      end: new Date(),
      availableApts: [],
    };
  }

  handleChange = (name) => (e) => {
    this.setState({ [name]: e });
  };

  addAvailability = (e) => {
    e.preventDefault();
    const { date, start, end } = e.target.elements;
    // console.log(date1.value);
    const cont = this.context;

    const st = date.value + " " + start.value;
    const ed = date.value + " " + end.value;

    let start_t = +new Date(st);
    let end_t = +new Date(ed);

    let start_ts = Math.floor(start_t / 1000);
    let end_ts = Math.floor(end_t / 1000);

    // Check if end time is less than start time
    if (end_ts <= start_ts) {
      return alert("Start time cannot be greater than end time");
    }

    // Cut the time range into hour time slots
    let start_point = start_ts;
    let end_point = start_ts + 3600;

    while (start_point < end_ts) {
      console.log("start pointer: " + start_point, "end pointer: " + end_point);

      db.collection("Appointment")
        .doc()
        .set({
          docName: this.state.doctorName,
          doctorId: cont.currentUser.uid,
          end: new Date(end_point * 1000),
          patientID: "",
          start: new Date(start_point * 1000),
          status: "open",
          title: "Open Appointment",
        });

      start_point += 3600;
      end_point += 3600;
    }

    console.log(end_ts);
  };

  deleteApt = (i) => {
    console.log(this.state.availableApts);

    this.setState((state) => ({
      availableApts: state.availableApts.filter((row, j) => j !== i),
    }));
    console.log(i);
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

          let months = [
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

          const date =
            months[start.getMonth()] +
            "/" +
            start.getDate() +
            "/" +
            start.getFullYear();

          const st = start.getHours() + ":" + start.getMinutes();
          const ed = end.getHours() + ":" + end.getMinutes();

          apt.push(date);
          apt.push(st);
          apt.push(ed);

          apts.push(apt);
        });
      })
      .then(() => {
        this.setState({ availableApts: apts });
      });
  }

  componentDidMount() {
    this.getAvailableApts();
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
      <div className="content" style={{ paddingTop: 50 }}>
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
                  <thead>
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
