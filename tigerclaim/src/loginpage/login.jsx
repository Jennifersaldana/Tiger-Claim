import React, { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith("@lsu.edu")) {
      setError("Please enter a valid LSU email (example: student@lsu.edu).");
      return;
    }

    localStorage.setItem("lostAndFoundUser", email);
    onLogin(email);  
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Tiger Claim</h1>
        <p>Enter your LSU email to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="example@lsu.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
