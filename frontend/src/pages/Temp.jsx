import React from "react";
import app from "../firebase";




export default function Temp() {
  const user = app.auth().currentUser;
  alert(user.uid)
  return (
      <div>
        <h1>This page is for testing Authentication</h1>
        <button onClick={() => app.auth().signOut()}>Sign out</button>
      </div>
  );
}
