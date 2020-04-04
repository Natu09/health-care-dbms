import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import LogInPage from "./pages/LogIn";
import SignUpPage from "./pages/SignUp";
import Admin from "./layouts/Admin.jsx";
import Doctor from "./layouts/Doctor.jsx";
import Nurse from "./layouts/Nurse.jsx";
import { AuthProvider } from "Auth";
import PrivateRoute from "./PrivateRoute";

import Temp from "./pages/Temp"; // Just for testing purposes

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Route exact path="/test" component={Temp} />{" "}
          <Route exact path="/login" component={LogInPage} />
          <Route exact path="/signup" component={SignUpPage} />
          {/* ALL THE PRIVATE ROUTES FOR A PATIENT */}
          <PrivateRoute exact path="/patient" component={Admin} />
          <PrivateRoute exact path="/Calendar" component={Admin} />
          {/* ALL THE PRIVATE ROUTES FOR A DOCTOR */}
          <PrivateRoute exact path="/doctor" component={Doctor} />
          <PrivateRoute exact path="/docCalendar" component={Doctor} />
          <PrivateRoute exact path="/editApts" component={Doctor} />
          {/* ALL THE PRIVATE ROUTES FOR A NURSE */}
          <PrivateRoute exact path="/nurse" component={Nurse} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
