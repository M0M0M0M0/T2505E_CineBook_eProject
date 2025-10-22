import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join CineBook today!</p>

        <form className="auth-form">
          <div className="form-group mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Create a password"
            />
          </div>

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
