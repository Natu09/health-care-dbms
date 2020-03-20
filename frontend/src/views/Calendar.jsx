// import { Calendar } from "@fullcalendar/core";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";


export default class Calendar extends React.Component {
   //calendarComponentRef = React.createRef();
  constructor(props){
    super(props)

    const options = {
      defaultView: "dayGridMonth",
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },

      plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
      ref:  this.calendarComponentRef,
      //weekends={ this.state.calendarWeekends }
      events: [ // initial event data
        {
          title: 'Dr. Wilson',
          start: new Date().setHours(15),
          end: new Date()//"2020-03-20:00:00",
        }
      ],
      eventColor: '#378006',
      displayEventEnd: true,
      dateClick: this.handleDateClick,
    }
    this.state = {
      options
    };
  }


  render() {
    const { options } = this.state;
    const mystyle = {
  color: "pink",
  backgroundColor: "pink",
  padding: "10px",
  fontFamily: "Arial"
  
};
    return (
      <div className='calendar' style = {mystyle}>
        <FullCalendar {...options}/>
      </div>
    )
  }

  // toggleWeekends = () => {
  //   this.setState({ // update a property
  //     calendarWeekends: !this.state.calendarWeekends
  //   })
  // }

  // gotoPast = () => {
  //   let calendarApi = this.calendarComponentRef.current.getApi()
  //   calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  // }

  // handleDateClick = (arg) => {
  //   if (true) {
  //     this.setState({  // add new event data
  //       calendarEvents: this.state.calendarEvents.concat({ // creates a new array
  //         title: 'New Event',
  //         start: arg.date,
  //         allDay: arg.allDay
  //       })
  //     })
  //   }
  // }

}

// function Calendar ({...props}){
//   return (
//     <FullCalendar
//       defaultView="dayGridMonth"
//       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
//       handleWindowResize={true}
//       themeSyste="bootstrap"
//     />

//   );
// }

// export default Calendar;
