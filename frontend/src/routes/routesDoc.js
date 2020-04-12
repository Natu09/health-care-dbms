import Calendar from "../views/docCalendar";
import EditApt from "../views/EditApts";
import DocRef from "../views/DocRef";

const dashboardRoutes = [
  {
    path: "/docCalendar",
    name: "Calendar",
    icon: "pe-7s-date",
    component: Calendar,
  },
  {
    path: "/editApts",
    name: "Edit Appointments",
    icon: "pe-7s-clock",
    component: EditApt,
  },

  {
    path: "/docReferrals",
    name: "Referral",
    icon: "pe-7s-note2",
    component: DocRef,
  },
];

export default dashboardRoutes;
