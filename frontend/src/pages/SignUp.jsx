import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app, { db } from "../firebase";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then(cred => {
            return db
              .collection("Users")
              .doc(cred.user.uid)
              .set({
                role: "patient"
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
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
