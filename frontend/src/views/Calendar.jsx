/*
 * This file creates the Calendar that can be viewed and interacted with
 * by the patient
 */

// Importing the required libraries
import React, { useEffect, useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
  // Intializing state variables
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = useState({});

  /**
   * The handleClickOpen function will display a modal when the user
   * clicks on an appointment. This modal will also condtionally render
   * a cancel and book appointment button when required, and will hide them
   * when not required. This function does not return anything but updates the
   * temp value which is used to query the firebase db.
   * @author: Seng Group 40
   * @param {event information} info Event object that was clicked
   *
   */
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

      var eventST = info.event.start.getTime();
      var eventET = info.event.end.getTime();

      var queryTime = db.collection("Appointment").where("patientID", "==", currentUser.uid);
      queryTime.get()
                .then(function(querySnapshot){
                  querySnapshot.forEach(function(doc){
                    var isConflict = checkConflict(eventST, eventET,
                      new Date(0).setUTCSeconds(doc.data().start.seconds), new Date(0).setUTCSeconds(doc.data().end.seconds))

                    console.log("Time Conflict:", isConflict);

                    if(isConflict == true && doc.id != info.event.id){
                      document.getElementById("buttonBook").style.visibility = "hidden";
                      document.getElementById("modal-description").innerHTML =
                      ' <DialogContentText  id="modal-description">' +
                      "<h5>" +
                      "Appointment cannot be booked because of a conflict with another appointment" + 
                      "<h5>" +
                      "</DialogContentText>";
                    }
                  })
                });

    if (info.event.extendedProps.status === "open") {
      document.getElementById("buttonCancel").style.visibility = "hidden";
    } else if (
      info.event.extendedProps.status === "booked" ||
      info.event.extendedProps.status === "pending"
    ) {
      document.getElementById("buttonBook").style.visibility = "hidden";
    }
    setTemp(info.event);
  };

  /**
   * The handleBook function will be used when a user clicks to book the
   * appointment. When the button is clicked, the events and firebase db
   * are updated accordingly.
   * @author: Seng Group 40
   *
   */
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
                title: "Pending - " + doc.data().docName,
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


  /**
   * The handleCancel function will be used when a user clicks to cancel the
   * appointment. When the button is clicked, the events and firebase db
   * are updated accordingly.
   * @author: Seng Group 40
   *
   */
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
           
            const cancelWarning = "There is less than 24 hrs to this appointment. If you cancel now there will be a financial penalty. Do you want to continue?";
            if ( doc.data().start.seconds - Date.now()/1000 < 24*60*60){
              if (window.confirm(cancelWarning)){
                query.update({
                  status: "open",
                  patientID: "NA",
                  patientName: "NA",
                  title: "Open - " + doc.data().docName,
                });
              }
            } else {
              query.update({
                status: "open",
                patientID: "NA",
                title: "Open - " + doc.data().docName,
              });
            }
          }
        }
      })
      .then((_) => {
        setEvents([]);
        getEvents();
      });
    setTemp({});
  };

  /**
   * The handleClosefunction will be used when a user clicks to exit the modal
   * @author: Seng Group 40
   *
   */
  const handleClose = () => {
    setOpen(false);
    setTemp({});
  };

  function checkConflict(EST, EET, PST, PET){
    if(PST < EST && PET < EST){
      return false;
    }else if(PST> EET){
      return false;
    }else{
      return true;
    }
  }

  function createCalendarEvent(appointmentData, id){
    const event = appointmentData;
    event.start = new Date(0).setUTCSeconds(appointmentData.start.seconds);
    event.end = new Date(0).setUTCSeconds(appointmentData.end.seconds);
    event.id = id;
    event.docName = "Dr. " + event.docName;

    switch (event.status) {
      case "booked":
        event.color = "blue"; // Blue
        break;
      case "pending":
        event.color = "orange"; // Yellow
        break;
      default:
        event.color = "green";
        break;
    }
    return event;
  }

  /**
   * The getEvents function will query the firebase db to find all matching
   * appointments for the current patient. It thend creates the events
   * and pushes them into the docApt array which is used to setEvents.
   * @author: Seng Group 40
   *
   */
  function getEvents() {
    const docApt = [];

    var openAppointments = db
      .collection("Appointment")
      .where("status", "==", "open");
    var patientAppointments = db
      .collection("Appointment")
      .where("patientID", "==", currentUser.uid);

    openAppointments.get().then(function (querySnapshot) {
      querySnapshot.forEach((appointment) => {
        let calEvent = createCalendarEvent(appointment.data(), appointment.id);
        docApt.push(calEvent);
      });
    });

    patientAppointments
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((appointment) => {
          let calEvent = createCalendarEvent(
            appointment.data(),
            appointment.id
          );
          docApt.push(calEvent);
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
      <div style={{ paddingTop: 20 }}>
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: "prev,next, today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          timeZone={'local'}
          handleWindowResize={true}
          events={events}
          editable={false}
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
          <DialogContentText id="modal-description">
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="buttonCancel"
            variant="outlined"
            onClick={handleCancel}
            color="secondary"
          >
            Cancel Appointment
          </Button>
          <Button
            id="buttonBook"
            variant="outlined"
            onClick={handleBook}
            color="primary"
          >
            Book Appointment
          </Button>
          <Button
            id="buttonExit"
            variant="outlined"
            onClick={handleClose}
            color="secondary"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
