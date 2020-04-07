import Calendar from "../views/docCalendar";
import EditApt from "../views/EditApts";

const dashboardRoutes = [
  {
    path: "/docCalendar",
    name: "Calendar",
    icon: "pe-7s-date",
    component: Calendar
  },
  {
    path: "/editApts",
    name: "Edit Appointments",
    icon: "pe-7s-note2",
    component: EditApt
  }
];

export default dashboardRoutes;
