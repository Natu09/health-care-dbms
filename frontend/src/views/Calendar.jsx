// import { Calendar } from "@fullcalendar/core";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
// import bootstrapPlugin from "@fullcalendar/bootstrap";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import { getRelevantEvents } from "@fullcalendar/core";

export default class Calendar extends React.Component {
  //calendarComponentRef = React.createRef();
  constructor(props) {
    super(props);

    const options = {
      defaultView: "dayGridMonth",
      header: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
      },

      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      ref: this.calendarComponentRef,
      eventColor: "#378006", // Greenish
      displayEventEnd: true,
      dateClick: this.handleDateClick,
      eventClick: this.handleEventClick
    };
    this.state = {
      options
    };
  }

  render() {
    const { options } = this.state;

    return (
      <div className="calendar">
        <FullCalendar {...options} events={getEvents()} />
      </div>
    );
  }

  // This function handles what to do when a user clicks an event
  // We can add more to confirm their selection and update the database
  handleEventClick = info => {
    if (window.confirm("Do you want to book this appointment?")) {
      // Add code here to actually book this in database
      alert("Your appointment with " + info.event.title + " was booked");
    }
  };
}

// This is the function that will interact with our database
// Needs to return an array of events in this form
function getEvents() {
  return [
    {
      title: "Dr. House",
      start: "2020-03-18T12:30:00",
      end: "2020-03-18T15:30:00"
    },
    {
      title: "Dr. Wilson",
      start: new Date(),
      end: new Date().setHours(15)
    }
  ];
}
