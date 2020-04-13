import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app, { db } from "../firebase.js";
import { AuthContext } from "../Auth.js";
import Patient from "layouts/Admin.jsx";
import Doctor from "layouts/Doctor.jsx";
import Nurse from "layouts/Nurse.jsx";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then((cred) => {
            db.collection("Users")
              .doc(cred.user.uid)
              .get()
              .then(function (doc) {
                if (doc.data().role === "patient") {
                  history.push("/patient");
                  return <Redirect to="/patient" component={Patient} />;
                } else if (doc.data().role === "doctor") {
                  history.push("/doctor");
                  return <Redirect to="/doctor" component={Doctor} />;
                } else if (doc.data().role === "nurse") {
                  history.push("/nurse");
                  return <Redirect to="/nurse" component={Nurse} />;
                }
              });
          });
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  // const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);

  // console.log(db.collection("Users").doc(currentUser.uid));

  // if the current users role is patient then redirect to patient
  // if (currentUser) {
  //   let role = db
  //     .collection("Users")
  //     .where("uid", "==", currentUser.uid)
  //     .get()
  //     .then(function (doc) {
  //       return doc.data().role;
  //     });

  //   console.log(role);
  //   return <Redirect to={"/" + role} />;
  // }

  return (
    <div>
      <div className="col-md-6 col-md-offset-3">
        <div className="card card-body text-dark">
          <h1
            className="text-center mb-3"
            style={{ fontWeight: "bold", color: "#000000" }}
          >
            AHS LOGIN
          </h1>
          <form
            onSubmit={handleLogin}
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div className="form-group">
              <label htmlFor="email" style={{ color: "#000000" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" style={{ color: "#000000" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ border: "2px solid green", color: "green" }}
            >
              Login
            </button>
          </form>
          <p align="center" style={{ padding: 20 }}>
            Are you a new user? <a href="signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
