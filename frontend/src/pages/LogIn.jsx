import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app, { db } from "../firebase.js";
import { AuthContext } from "../Auth.js";
import Admin from "layouts/Admin.jsx";
import Doctor from "layouts/Doctor.jsx";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then(cred => {
            db.collection("Users")
              .doc(cred.user.uid)
              .get()
              .then(function(doc) {
                if (doc.data().role === "patient") {
                  history.push("/patient");
                  return <Redirect to="/patient" component={Admin} />;
                } else if (doc.data().role === "doctor") {
                  history.push("/doctor");
                  return <Redirect to="/doctor" component={Doctor} />;
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
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
