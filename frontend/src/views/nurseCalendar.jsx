import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

import { AuthContext } from "../Auth";
import { db } from "../firebase";

export default function NurseCalendar(props) {
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  /// Options for the calendar component
  const options = {
    defaultView: "dayGridMonth",
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    eventColor: "#378006", // Greenish
    displayEventEnd: true,
  };

  function getFields() {
    var query = db.collection("Users").doc(currentUser.uid);

    const doctor = ""
    query.get().then(function (user) {
      if (user.exists) {
        console.log("userdata:", user.data());
      /// return
      // doctor = ....
      }
    })
    // return doctor
  }


  /**
   * Retrieves all events related to the doctos
   */
  function getEvents() {
    const docApt = [];

    const associatedDoctor = ""//getFields()
    // console.log(getFields());
    db.collection("Appointment")
      .where("doctorID", "==", associatedDoctor)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          // Reformating time format for full calendar event

          // Seting the Unix time
          const epochStart = doc.data().start.seconds;
          const epochEnd = doc.data().end.seconds;

          // Initilizing new Date objets
          let start = new Date(0);
          let end = new Date(0);

          // Set date object times to Unix time from event object
          start.setUTCSeconds(epochStart);
          end.setUTCSeconds(epochEnd);

          const event = doc.data();
          event.start = start;
          event.end = end;

          
          // Set the event colour depending on its status
          if (doc.data().status === "booked") {
            event.color = "#0000ff";         // Blue
          } else if (doc.data().status === "pending") {
            event.color = "#ffe642";        // Yellow
          }


          docApt.push(event);
        });
      })
      .then(() => {
        setEvents(docApt);
      });
  }

  useEffect(() => {
    getEvents(); // Change event state and mount
  });

  // Render view
  return (
    <div className="calendar">
      <FullCalendar {...options} events={events} />
    </div>
  );
}
