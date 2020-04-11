import UserProfile from "views/UserProfile.jsx";
import Calendar from "views/Calendar.jsx";
import Reference from "views/Reference.jsx";

const dashboardRoutes = [
  {
    path: "/patient",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "pe-7s-date",
    component: Calendar,
    layout: "/admin",
  },
  {
    path: "/reference",
    name: "Reference",
    icon: "pe-7s-note2",
    component: Reference,
    layout: "/admin",
  },
];

export default dashboardRoutes;
