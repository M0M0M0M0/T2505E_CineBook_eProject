import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setMessage("⚠️ Please fill in all fields.");
      setShowMessage(true);
      return;
    }

    setShowMessage(false);
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join CineBook today!</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {showMessage && (
            <div className="alert alert-warning text-center py-2">
              {message}
            </div>
          )}

          <button type="submit" className="btn btn-warning w-100 auth-btn">
            Register
          </button>

          <p className="text-center mt-3 text-light">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
