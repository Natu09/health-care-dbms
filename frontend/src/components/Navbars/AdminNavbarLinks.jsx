import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import app from "../firebase";


class AdminNavbarLinks extends Component {
  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            Account
          </NavItem>

          <NavItem onClick={() => app.auth().signOut()} href="#">
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
