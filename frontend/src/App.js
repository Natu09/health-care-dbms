import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import LogInPage from "./pages/LogIn";
import SignUpPage from "./pages/SignUp";
import { AuthProvider } from "Auth";
import PrivateRoute from "PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PrivateRoute exact path="/" />
        <Route exact path="/login" component={LogInPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
