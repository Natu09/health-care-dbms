import React from "react";

export default function Home() {
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
          <a href="/signup" className="btn btn-primary btn-block mb-2">
            Register
          </a>
          <a
            href="/login"
            className="btn btn-secondary btn-block"
            style={{ border: "2px solid green", color: "green" }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
