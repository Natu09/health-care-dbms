import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app, { db } from "../firebase";

const label = {
  display: "inline-block",
  width: "230px",
  textAlign: "right",
};

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { Fname, Lname, email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then((cred) => {
            return db.collection("Users").doc(cred.user.uid).set({
              role: "patient",
              First_name: Fname.value,
              Last_name: Lname.value,
              email: email.value,
            });
          });
        history.push("/patient");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div>
      <div class="col-md-6 col-md-offset-3">
        <div class="card card-body">
          <h1
            class="text-center mb-3"
            style={{ fontWeight: "bold", color: "#000000" }}
          >
            AHS SIGN UP
          </h1>
          <form
            onSubmit={handleSignUp}
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div class="form-group">
              <label for="name" style={{ color: "#000000" }}>
                First Name
              </label>
              <input
                type="text"
                id="Fname"
                name="Fname"
                class="form-control"
                placeholder="Enter First Name"
                required
              />
            </div>
            <div class="form-group">
              <label for="name" style={{ color: "#000000" }}>
                Last Name
              </label>
              <input
                type="text"
                id="Lname"
                name="Lname"
                class="form-control"
                placeholder="Enter Last Name"
                required
              />
            </div>
            <div class="form-group">
              <label for="email" style={{ color: "#000000" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                placeholder="Enter Email"
              />
            </div>
            <div class="form-group">
              <label for="password" style={{ color: "#000000" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                placeholder="Create Password"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
              style={{ border: "2px solid green", color: "green" }}
            >
              Sign Up
            </button>
          </form>
          <p align="center">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignUp);
