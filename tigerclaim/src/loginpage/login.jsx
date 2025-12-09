import React, { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!email.endsWith("@lsu.edu")) {
      setError("Please enter a valid LSU email (example: student@lsu.edu).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    onLogin(email); 
  };

  return (
    <div className="login-fullscreen">
      <img
        src="/clean-tiger-claim.png"
        className="background-image"
        alt="Tiger Claim"
      />

      <div className="center-box">
        <div className="login-card">
          <h1>Log In</h1>
          <p>Enter your LSU credentials</p>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <input
              type="email"
              placeholder="example@lsu.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="login-btn">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
