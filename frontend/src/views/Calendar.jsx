import React, { useEffect, useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";

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

export default () => {
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = useState({});

  const handleClickOpen = (info) => {
    setOpen(true);
    document.getElementById("alert-dialog-title").innerHTML =
      ' <DialogTitle id="alert-dialog-title">' +
      info.event.title +
      "</DialogTitle>";

    setTemp(info.event);
  };

  const handleBook = () => {
    setOpen(false);
    let query = db.collection("Appointment").doc(temp.id);
    console.log(query);
    query.get().then(function (doc) {
      if (doc.exists) {
        if (doc.data().status === "open") {
          query.update({
            status: "pending",
            patientID: currentUser.uid,
            title: "Booked Appointment",
          });
        }
      }
    });
    setTemp({});
  };

  const handleClose = () => {
    setOpen(false);
    let query = db.collection("Appointment").doc(temp.id);
    console.log(query);
    console.log(temp);
    query.get().then(function (doc) {
      if (doc.exists) {
        if (doc.data().status === "booked" || doc.data().status === "booked") {
          query.update({
            status: "open",
            patientID: "N/A",
            title: "Open Appointment",
          });
        }
      }
    });
    setTemp({});
  };

  /**
   * Retrieves all events related to the doctos
   */
  function getEvents() {
    const docApt = [];
    // console.log(currentUser.uid)

    var query1 = db.collection("Appointment").where("status", "==", "open");
    var query2 = db
      .collection("Appointment")
      .where("patientID", "==", currentUser.uid);

    query1.get().then(function (querySnapshot) {
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
        let doctorName = doc.data().docName;
        event.start = start;
        event.end = end;
        event.id = doc.id;
        event.docName = "Dr. " + doctorName;
        event.title = doc.data().title;

        // Set apt colour here
        if (doc.data().status === "pending") {
          event.color = "orange ";
        } else if (doc.data().status === "booked") {
          event.color = "green";
        } else {
          event.color = "blue";
        }

        docApt.push(event);
      });
    });
    query2
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
          let doctorName = doc.data().docName;
          event.start = start;
          event.end = end;
          event.id = doc.id;
          event.docName = "Dr. " + doctorName;
          event.title = doc.data().title;

          console.log(doc.data().status);
          // Set apt colour here
          if (doc.data().status === "pending") {
            event.color = "orange ";
          } else if (doc.data().status === "booked") {
            event.color = "green";
          } else {
            event.color = "blue";
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
  }, []);

  // Render view
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <FullCalendar
        defaultView="dayGridMonth"
        header={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        handleWindowResize={true}
        events={events}
        themeSystem="bootstrap"
        displayEventEnd={true}
        eventClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> Modal Title </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Appointment Content goes here
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleBook} color="primary">
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
