import nurseCalendar from "../views/nurseCalendar.jsx";

const dashboardRoutes = [
  {
    path: "/nurse",
    name: "Calendar",
    icon: "pe-7s-date",
    component: nurseCalendar,
    layout: "/nurse",
    id: 3, // Remove later
  },
];

export default dashboardRoutes;
