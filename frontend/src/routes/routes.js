import UserProfile from "views/UserProfile.jsx";
import Calendar from "views/Calendar.jsx";

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
];

export default dashboardRoutes;
