import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar"; // Change later
import Sidebar from "components/Sidebar/Sidebar";
import docCalendar from "views/docCalendar.jsx";

import routes from "../routes/routesDoc";
import PrivateRoute from "../PrivateRoute";
import { AuthContext } from "../Auth";

import { db } from "../firebase";

class Doctor extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    console.log(props);
    console.log(this.props);
    this.state = {
      color: "red",
      hasImage: true,
      user: ""
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      return (
        <Route
          path={prop.layout + prop.path}
          render={props => <prop.component {...props} />}
          key={key}
        />
      );
    });
  };

  /**
   * Find query the doctor name
   *
   */
  getDoctorName = dID => {
    const cont = this.context;
    console.log(cont.currentUser.uid);

    try {
      db.collection("Users")
        .doc(cont.currentUser.uid)
        .get()
        .then(doc => {
          console.log(doc.data().lname);
          return "Doctor";
        });
    } catch (error) {
      return "???";
    }
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
    console.log(cont.currentUser.uid);

    try {
      db.collection("Users")
        .doc(cont.currentUser.uid)
        .get()
        .then(doc => {
          console.log(doc.data().lname);
          this.setState({ user: doc.data().lname });
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
            // brandText={this.getDoctorName(this.props.location.pathname)}
            brandText={"Hello Dr. " + this.state.user}
          />
          <Switch>
            <PrivateRoute exact path="/doctor" component={docCalendar} />
            <PrivateRoute exact path="/doc" component={docCalendar} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Doctor;
