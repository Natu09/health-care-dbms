import React, { Component } from "react";
import { Switch, Redirect } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar"; // Change later
import Sidebar from "components/Sidebar/Sidebar";

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
      lname: ""
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      return (
        <PrivateRoute
          exact
          path={prop.path}
          component={prop.component}
          //key={key}
        />
      );
    });
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
        .then(doc => {
          this.setState({ lname: doc.data().lname });
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
            brandText={"Hello Dr. " + this.state.lname}
          />
          <Switch>
            <Redirect from="/doctor" to="/editApts" />
            {this.getRoutes(routes)}
          </Switch>
        </div>
      </div>
    );
  }
}

export default Doctor;
