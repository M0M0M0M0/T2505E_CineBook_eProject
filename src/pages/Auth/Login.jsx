import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { API_BASE_URL } from "../../api/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
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
      const loginUrl = isAdmin
        ? `${API_BASE_URL}/login?type=admin`
        : `${API_BASE_URL}/login`;

      const res = await axios.post(loginUrl, {
        email,
        password,
      });

      // console.log("✅ Login response:", res.data);

      // Lưu token
      localStorage.setItem("token", res.data.access_token);

      // ✅ XỬ LÝ ĐÚNG CHO CẢ ADMIN VÀ CUSTOMER
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ ADMIN: Dùng staff_id, CUSTOMER: Dùng user_id
        const userId = res.data.user.staff_id || res.data.user.user_id;
        localStorage.setItem("user_id", userId);

        // ✅ Lưu user_type
        localStorage.setItem("user_type", res.data.user.user_type);

        // console.log("✅ Saved user info:", {
        //   user_id: userId,
        //   user_type: res.data.user.user_type,
        //   is_admin: res.data.user.user_type === "staff",
        // });
      }

      // Dispatch event login để Header update ngay
      window.dispatchEvent(new Event("login"));

      // Chuyển trang
      if (isAdmin && res.data.user.user_type === "staff") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="adminCheckbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              disabled={loading}
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label text-light"
              htmlFor="adminCheckbox"
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              🔐 Login as Admin
            </label>
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
            {loading ? "Logging in..." : isAdmin ? "Login as Admin" : "Login"}
          </button>

          <p className="text-center mt-3 text-light">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
