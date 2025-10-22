import React, { useState } from "react";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-sidebar">
        <h3 className="user-dashboard-title">My Account</h3>
        <ul>
          <li
            className={activeTab === "tickets" ? "active" : ""}
            onClick={() => setActiveTab("tickets")}
          >
            🎟 My Tickets
          </li>
          <li
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            🕓 History
          </li>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile Info
          </li>
        </ul>
      </div>

      <div className="user-dashboard-content">
        {activeTab === "tickets" && <MyTickets />}
        {activeTab === "history" && <History />}
        {activeTab === "profile" && <Profile />}
      </div>
    </div>
  );
}

function MyTickets() {
  return (
    <div className="user-dashboard-section">
      <h4>🎬 Current Bookings</h4>
      <div className="ticket-card">
        <h5>Avengers: Endgame</h5>
        <p>
          <strong>Theater:</strong> CGV Aeon Mall Hà Đông
        </p>
        <p>
          <strong>Showtime:</strong> 25 Oct 2025, 19:00
        </p>
        <p>
          <strong>Seats:</strong> G5, G6
        </p>
        <button className="btn btn-warning">View E-Ticket</button>
      </div>
    </div>
  );
}

function History() {
  return (
    <div className="user-dashboard-section">
      <h4>🕓 Watched Movies</h4>
      <div className="ticket-card">
        <h5>Oppenheimer</h5>
        <p>
          <strong>Theater:</strong> Lotte Cinema West Lake
        </p>
        <p>
          <strong>Date:</strong> 10 Sep 2025
        </p>
        <p>
          <strong>Seats:</strong> D3, D4
        </p>
        <button className="btn btn-outline-light">Rate Movie</button>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="user-dashboard-section">
      <h4>👤 Profile Information</h4>
      <form className="profile-form">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="Your name" />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Your email" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Phone</label>
            <input type="text" className="form-control" placeholder="Your phone number" />
          </div>
          <div className="col-md-6">
            <label>City</label>
            <input type="text" className="form-control" placeholder="City" />
          </div>
        </div>

        <button type="submit" className="btn btn-warning">
          Save Changes
        </button>
      </form>
    </div>
  );
}
