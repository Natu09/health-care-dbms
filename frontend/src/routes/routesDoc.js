import Dashboard from "../views/Dashboard.jsx";
import UserProfile from "../views/UserProfile.jsx";
import Calendar from "../views/Calendar.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/doctor"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/doctor"
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "pe-7s-date",
    component: Calendar,
    layout: "/doctor",
    id: 3 // Remove later
  }
];

export default dashboardRoutes;
