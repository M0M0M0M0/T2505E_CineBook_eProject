import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setMessage("⚠️ Please enter both email and password.");
      setShowMessage(true);
      return;
    }

    // Nếu có dữ liệu hợp lệ, có thể xử lý đăng nhập ở đây
    setShowMessage(false);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your CineBook account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {showMessage && (
            <div className="alert alert-warning text-center py-2">
              {message}
            </div>
          )}

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
