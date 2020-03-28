import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app, { db } from "../firebase";

const label = {
  display: "inline-block",
  width: "230px",
  textAlign: "right"
};

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async event => {
      event.preventDefault();
      const { Fname, Lname, email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then(cred => {
            return db
              .collection("Users")
              .doc(cred.user.uid)
              .set({
                role: "patient",
                First_name: Fname.value,
                Last_name: Lname.value
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
    <div align="center">
      <h1 align="center">Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label style={label}>
            First Name{" "}
            <input name="Fname" type="text" placeholder="First" required />
          </label>
        </div>
        <div>
          <label style={label}>
            Last Name{" "}
            <input name="Lname" type="text" placeholder="Last" required />
          </label>
        </div>
        <div>
          <label style={label}>
            Email{" "}
            <input name="email" type="email" placeholder="Email" required />
          </label>
        </div>
        <div>
          <label style={label}>
            Password{" "}
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </label>
        </div>
        <button type="submit" align="center">
          Sign Up
        </button>
      </form>
      <div>
        <label>Already have an account?</label>
        <a href="/login" class="button">
          {" "}
          Click here to Log In
        </a>
      </div>
    </div>
  );
};

export default withRouter(SignUp);
