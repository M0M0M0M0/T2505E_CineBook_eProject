import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { API_BASE_URL } from "../../api/config";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearMessage = () => setMessage("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !dateOfBirth.trim() ||
      !address.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        full_name: fullName,
        date_of_birth: dateOfBirth,
        address,
        phone_number: phoneNumber,
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      window.dispatchEvent(new Event("login"));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("❌ Register failed. Please check your information.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join CineBook today</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-2">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control auth-input"
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-2">
            <label>Address</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="Enter address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-2">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearMessage();
              }}
              disabled={loading}
            />
          </div>

          {message && (
            <div className="alert alert-warning text-center py-2">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-warning w-100 auth-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
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
