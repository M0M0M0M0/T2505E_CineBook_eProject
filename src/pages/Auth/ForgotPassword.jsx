import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMessage("⚠️ Please enter your email address.");
      setShowMessage(true);
      return;
    }

    // Simulate sending reset link
    setTimeout(() => {
      setMessage("✅ Password reset link has been sent! Please check your inbox.");
      setShowMessage(true);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to reset your password</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label>Email</label>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 auth-btn">
            Send Reset Link
          </button>

          {/* ✅ Message box */}
          {showMessage && (
            <div
              className={`message-popup ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center mt-3 text-light">
            <Link to="/login" className="auth-link">
              ← Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
