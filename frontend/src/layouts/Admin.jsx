import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";

import Sidebar from "components/Sidebar/Sidebar";

import routes from "../routes/routes";

import PrivateRoute from "../PrivateRoute";

import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import Calendar from "views/Calendar.jsx";
import Typography from "views/Typography.jsx";
import Icons from "views/Icons.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
      hasImage: true
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route render={props => <prop.component {...props} />} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            <PrivateRoute exact path="/patient" component={Dashboard} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/user" component={UserProfile} />
            <PrivateRoute exact path="/Typography" component={Typography} />
            <PrivateRoute exact path="/Icons" component={Icons} />
            <PrivateRoute exact path="/Maps" component={Maps} />
            <PrivateRoute exact path="/Calendar" component={Calendar} />
            <PrivateRoute
              exact
              path="/Notifications"
              component={Notifications}
            />
          </Switch>
          {/* <Switch>{component={this.getRoutes(routes)}}</Switch> */}
        </div>
      </div>
    );
  }
}
export default Admin;
