import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

export default () => {
  document.addEventListener("DOMContentLoaded", function() {
    var calendarEl = document.getElementById("calendar");

    var calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin]
    });

    calendar.render();
  });
};
