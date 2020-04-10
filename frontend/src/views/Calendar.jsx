import React, { useEffect, useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";

// import { withStyles } from "@material-ui/core/styles";

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
    document.getElementById("modal-title").innerHTML =
      ' <DialogTitle id="modal-title"> <h3>' +
      info.event.title +
      "</ h3> </DialogTitle>";

    document.getElementById("doctor-name").innerHTML =
      ' <DialogContentText  id="doctor-name">' +
      "<h5>" +
      "Doctor: " +
      info.event.extendedProps.docName +
      "<h5>" +
      "</DialogContentText>";

    document.getElementById("start-time").innerHTML =
      ' <DialogContentText  id="start-time">' +
      "<h5>" +
      "Start Time: " +
      info.event.start +
      "<h5>" +
      "</DialogContentText>";

    document.getElementById("end-time").innerHTML =
      ' <DialogContentText  id="end-time">' +
      "<h5>" +
      "End Time: " +
      info.event.end +
      "<h5>" +
      "</DialogContentText>";

    setTemp(info.event);
  };

  const handleBook = () => {
    setOpen(false);
    let query = db.collection("Appointment").doc(temp.id);
    query
      .get()
      .then(function (doc) {
        if (doc.exists) {
          if (doc.data().status === "open") {
            query.update({
              status: "pending",
              patientID: currentUser.uid,
              title: "Pending Appointment",
            });
          }
        }
      })
      .then((_) => {
        setEvents([]);
        getEvents();
      });
    setTemp({});
  };

  const handleCancel = () => {
    setOpen(false);
    let query = db.collection("Appointment").doc(temp.id);
    query
      .get()
      .then(function (doc) {
        if (doc.exists) {
          if (
            doc.data().status === "booked" ||
            doc.data().status === "pending"
          ) {
            query.update({
              status: "open",
              patientID: "N/A",
              title: "Open Appointment",
            });
          }
        }
      })
      .then((_) => {
        setEvents([]);
        getEvents();
      });
    setTemp({});
  };

  const handleClose = () => {
    setOpen(false);
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
          event.color = "blue";
        } else {
          event.color = "green";
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

          // Set apt colour here
          if (doc.data().status === "pending") {
            event.color = "orange ";
          } else if (doc.data().status === "booked") {
            event.color = "blue";
          } else {
            event.color = "green";
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
      <div>
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
          editable={true}
          themeSystem="bootstrap"
          allDay={true}
          aspectRatio={2}
          displayEventEnd={true}
          eventClick={handleClickOpen}
        />
      </div>
      <Dialog open={open} onClick={handleClose}>
        <DialogTitle disableTypography id="modal-title">
          <h3> Modal Title </h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="doctor-name">
            Appointment Content goes here
          </DialogContentText>
          <DialogContentText id="start-time">
            Appointment Content goes here
          </DialogContentText>
          <DialogContentText id="end-time">
            Appointment Content goes here
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel} color="secondary">
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
