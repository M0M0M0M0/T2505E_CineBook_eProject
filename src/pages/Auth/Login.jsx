import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your CineBook account</p>

        <form className="auth-form">
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
              placeholder="Enter your password"
            />
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>


          <button type="submit" className="btn btn-warning w-100 auth-btn">
            Login
          </button>

          <p className="text-center mt-3 text-light">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
