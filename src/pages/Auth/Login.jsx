import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { API_BASE_URL } from "../../api/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      // Lưu token
      localStorage.setItem("token", res.data.access_token);

      // Lưu user nếu backend trả về
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // ✅ Dispatch event login để Header update ngay
      window.dispatchEvent(new Event("login"));

      // Chuyển trang về home
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              disabled={loading}
            />
          </div>

          {message && (
            <div className="alert alert-warning text-center py-2">
              {message}
            </div>
          )}

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
