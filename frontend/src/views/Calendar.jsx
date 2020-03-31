import React, { useEffect, useState, useContext } from "react";
import Popup from 'react-popup';

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

export default function DocCalendar(props) {


  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  /// Options for the calendar component
  const options = {
    defaultView: "dayGridMonth",
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    eventColor: "#378006", // Greenish
    displayEventEnd: true,
    eventClick: handleEventClick,

  };


  function handleEventClick(info){
    var query = db.collection("Appointment").doc(info.event.id)

    query.get()
        .then(function(doc) {
          if (doc.exists){
            if (doc.data().status == "open"){
              if (window.confirm("Do you want to book this appointment?")){
                query.update({
                  status: "booked",
                  patientID: currentUser.uid,
                  title: "booked Appointment"
                })
                alert("Appointment Booked") // done
              }
            }
            if (doc.data().status == "booked"){
              if (window.confirm("Do you want to cancel this appointment?")){
                query.update({
                              status: "open",
                              patientID: "N/A",
                              title: "Open Appointment"
                              })


                alert("Appointment Cancelled") // done


              }
            }
          }
        });
  }

  /**
   * Retrieves all events related to the doctos
   */
  function getEvents() {
    const docApt = [];
    // console.log(currentUser.uid)

    var query1 = db.collection("Appointment").where("status", "==", "open")
    var query2 = db.collection("Appointment").where("patientID", "==", currentUser.uid)

    query1.get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(doc => {
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
              event.id = doc.id;

              // Set apt colour here

              docApt.push(event);
            });
          });
      query2.get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(doc => {
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
                event.id = doc.id;

                // Set apt colour here

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
