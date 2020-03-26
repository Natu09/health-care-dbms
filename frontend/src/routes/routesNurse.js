import docCalendar from "../views/docCalendar.jsx";

const dashboardRoutes = [
  {
    path: "/doctor",
    name: "Calendar",
    icon: "pe-7s-date",
    component: docCalendar,
    layout: "/doctor",
    id: 3 // Remove later
  }
];

export default dashboardRoutes;
