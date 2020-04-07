import React, { Component } from "react";
import { addDays } from "@fullcalendar/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Button } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { Card } from "components/Card/Card.jsx";

const d = addDays(new Date(), 1);
d.setHours(9);
d.setMinutes(0);

export default class EditApts extends Component {
  state = {
    date: d,
    start: d,
    end: d,
  };

  handleChange = (name) => (e) => {
    alert(e);
    this.setState({ [name]: e });
  };

  addAvailability = (e) => {
    e.preventDefault();
    const { date1, start1, end1 } = e.target.elements;
    console.log(date1.value);
  };

  render() {
    const { date, start, end } = this.state;
    return (
      <div className="content">
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Card
            title="Add Availability"
            content={
              <form onSubmit={this.addAvailability}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-evenly">
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
                  </Grid>
                </MuiPickersUtilsProvider>
                <Button variant="outlined" type="submit" primary={true}>
                  Add
                </Button>
              </form>
            }
          />
        </Grid>
      </div>
    );
  }
}
