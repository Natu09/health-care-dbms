import docCalendar from "../views/nurseCalendar.jsx";

const dashboardRoutes = [
  {
    path: "/nurse",
    name: "Calendar",
    icon: "pe-7s-date",
    component: docCalendar,
    layout: "/nurse",
    id: 3, // Remove later
  },
];

export default dashboardRoutes;
