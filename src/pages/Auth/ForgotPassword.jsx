import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/config"; 
import "./Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [resetToken, setResetToken] = useState("");

  //  VERIFY EMAIL 
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/forgot-password", { email });

      if (!res.data.success) {
        setMsg("❌ Email không tồn tại trong hệ thống");
        return;
      }

      setResetToken(res.data.token);
      setStep("password");
      setMsg("✅ Email hợp lệ, mời nhập mật khẩu mới");
    } catch (err) {
      setMsg(
        err.response?.data?.message || "❌ Email không tồn tại trong hệ thống"
      );
    } finally {
      setLoading(false);
    }
  };

  //  RESET PASSWORD 
  const handleResetPass = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setPassError("❌ 2 mật khẩu không khớp");
      return;
    }

    setLoading(true);
    setPassError("");
    setMsg("");

    try {
      const res = await api.post("/reset-password", {
        email,
        password,
        token: resetToken,
      });

      setMsg("✅ Đổi mật khẩu thành công! Chuyển về Login...");

      setStep("email");
      setEmail("");
      setPassword("");
      setConfirmPass("");
      setResetToken("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setPassError(err.response?.data?.message || "❌ Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>

        {msg && (
          <div style={{ color: "#ffd700", fontSize: "14px", marginBottom: 10 }}>
            {msg}
          </div>
        )}

        {step === "email" && (
          <>
            <p className="auth-subtitle">Nhập email để reset mật khẩu</p>
            <form className="auth-form" onSubmit={handleVerify}>
              <div className="form-group mb-4">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 auth-btn"
                disabled={loading}
              >
                {loading ? "Checking..." : "Verify Email"}
              </button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <p className="auth-subtitle">Nhập mật khẩu mới</p>

            <form className="auth-form" onSubmit={handleResetPass}>
              <div className="form-group mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPassError("");
                  }}
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-1">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control auth-input"
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                    setPassError("");
                  }}
                  disabled={loading}
                />
              </div>

              {confirmPass.length > 0 && (
                <div
                  style={{
                    color: confirmPass === password ? "lightgreen" : "#ff4d4d",
                    fontSize: "14px",
                  }}
                >
                  {confirmPass === password ? "✅ match" : "❌ not match"}
                </div>
              )}

              {passError && (
                <div className="message-popup error mt-2">{passError}</div>
              )}

              <button
                type="submit"
                className="btn btn-success w-100 auth-btn mt-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Change Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-center mt-3 text-light">
          <Link to="/login" className="auth-link">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
