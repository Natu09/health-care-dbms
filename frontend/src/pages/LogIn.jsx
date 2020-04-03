import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app, { db } from "../firebase.js";
import { AuthContext } from "../Auth.js";
import Patient from "layouts/Admin.jsx";
import Doctor from "layouts/Doctor.jsx";
import Nurse from "layouts/Nurse.jsx";

const label = {
  display: "inline-block",
  width: "230px",
  textAlign: "right",
};
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

  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);
  // if (db.collection("Users").doc(user.uid)) {

  // }
  // if (currentUser) {
  //   return <Redirect to="/" />;
  // }

  return (
    <div class="row mt-5">
      <div class="col-md-6 col-md-offset-3 =">
        <div class="card card-body">
          <h1 class="text-center mb-3">
            <i class="fas fa-sign-in-alt"></i> Login
          </h1>
          <form onSubmit={handleLogin}>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                placeholder="Enter Email"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                placeholder="Enter Password"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
              style={{ border: "2px solid green", color: "green" }}
            >
              Login
            </button>
          </form>
          <p align="center">
            Are you a new user? <a href="signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
