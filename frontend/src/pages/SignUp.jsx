import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app, { db } from "../firebase";

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
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Email
          <input name="Fname" type="text" placeholder="first" />
        </label>
        <label>
          Email
          <input name="Lname" type="text" placeholder="last" />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        {/* <label>
          Confirm Password
          <input name="password" type="password" placeholder="Password" />
        </label> */}
        <button type="submit">Sign Up</button>
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
