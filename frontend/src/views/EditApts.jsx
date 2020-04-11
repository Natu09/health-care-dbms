import React, { Component, context } from "react";
import { addDays } from "@fullcalendar/core";
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

const d = addDays(new Date(), 1);
d.setHours(9);
d.setMinutes(0);

const thArr = ["Date", "Start", "End", "Actions"];

export default class EditApts extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      date: d,
      start: d,
      end: d,
      availableApts: [],
    };
  }

  handleChange = (name) => (e) => {
    alert(e);
    this.setState({ [name]: e });
  };

  addAvailability = (e) => {
    e.preventDefault();
    const { date1, start1, end1 } = e.target.elements;
    // console.log(date1.value);
  };

  deleteApt(i) {
    this.setState((state) => ({
      availableApts: delete state.availableApts[i],
    }));
    // this.setState({ availableApts: delete this.state.availableApts[index] });
    console.log(i);
  }

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
  }

  render() {
    const { date, start, end } = this.state;
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
                      required
                      name="date1"
                      size="medium"
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date"
                      value={date}
                      onChange={this.handleChange("date")}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                    <KeyboardTimePicker
                      required
                      name="start1"
                      variant="inline"
                      size="medium"
                      margin="normal"
                      id="time-picker"
                      label="Start Time"
                      format="HH:mm"
                      value={start}
                      onChange={this.handleChange("start")}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                    <KeyboardTimePicker
                      required
                      name="end1"
                      variant="inline"
                      size="medium"
                      margin="normal"
                      id="time-picker"
                      label="End Time"
                      format="HH:mm"
                      value={end}
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
