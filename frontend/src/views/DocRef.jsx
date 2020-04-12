import React, { Component } from "react";

import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { Table } from "react-bootstrap";
// import { AuthContext } from "..Auth";
// import { db } from "../firebase";

const tableHeader = ["Patient ID", "Name", ""];

export class DocRef extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      cont: this.cont,
      patients: [],
    };
  }

  getPatients() {
    return;
  }

  componentDidMount() {
    getPatients();
  }

  render() {
    return (
      <div
        className="content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   position: "absolute",
          margin: "auto",
          //   top: 0,
          //   right: 0,
          //   bottom: 0,
          //   left: 0,
        }}
      >
        <Grid>
          <Card
            title="Patients"
            content={
              <Table hover>
                <thead>
                  {["Patient ID", "Patient Name", ""].map((title, key) => {
                    return <th key={key}>{title}</th>;
                  })}
                </thead>
                <tbody></tbody>
              </Table>
            }
          />
        </Grid>
      </div>
    );
  }
}

export default DocRef;
