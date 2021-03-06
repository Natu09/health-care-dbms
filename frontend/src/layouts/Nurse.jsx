import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar"; // Change later

import Sidebar from "components/Sidebar/Sidebar";

import routes from "../routes/routesNurse";

import PrivateRoute from "../PrivateRoute";
import { db } from "../firebase";
import { AuthContext } from "../Auth";

import nurseCalendar from "views/nurseCalendar.jsx";

class Nurse extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    console.log(props);
    console.log(this.props);
    this.state = {
      color: "red",
      hasImage: true,
      fname: "",
      lname: "",
    };
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/nurse") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Nurse";
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

  componentDidMount() {
    const cont = this.context;

    // Get the user lastname and set the sate of user lastname
    try {
      db.collection("Users")
        .doc(cont.currentUser.uid)
        .get()
        .then((doc) => {
          this.setState({
            fname: doc.data().fname,
            lname: doc.data().lname,
          });
        });
    } catch (error) {
      console.log(error);
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
            brandText={
              "Hello " + this.state.fname + " " + this.state.lname + " !"
            }
          />
          <Switch>
            <PrivateRoute exact path="/nurse" component={nurseCalendar} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Nurse;
