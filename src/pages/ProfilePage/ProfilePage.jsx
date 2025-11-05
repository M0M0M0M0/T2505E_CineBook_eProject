import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  useEffect(() => {
    setTickets([
      {
        id: 1,
        movie: "Avatar 3",
        theater: "CGV Aeon Mall",
        date: "2025-05-10",
        seats: ["C5", "C6"],
        status: "Booked",
        poster: "https://example.com/poster.jpg",
      },
    ]);

    setHistoryTickets([]);
  }, []);

  const [fullName, setFullName] = useState("Name");
  const [dob, setDob] = useState("1975-04-30");
  const [phone, setPhone] = useState("Phone Number");
  const [address, setAddress] = useState("City");
  const [email, setEmail] = useState("Email");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // force redirect
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.user;
        setFullName(user.full_name ?? "");
        setDob(user.date_of_birth ?? "");
        setPhone(user.phone_number ?? "");
        setAddress(user.address ?? "");
        setEmail(user.email ?? "");
      })
      .catch(console.log);
  }, [token]);

  const handleSaveProfile = () => {
    axios
      .patch(
        "http://127.0.0.1:8000/api/user-profile",
        {
          full_name: fullName,
          dob,
          phone,
          address,
        },
        axiosConfig
      )
      .then((res) => alert("Profile updated successfully"))
      .catch((err) => console.log(err));
  };

  const handleChangePassword = () => {
    axios
      .patch(
        "http://127.0.0.1:8000/api/user-profile/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmNewPassword,
        },
        axiosConfig
      )
      .then((res) => alert(res.data.message))
      .catch((err) => {
        if (err.response?.data?.message) alert(err.response.data.message);
        else console.log(err);
      });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Kiểm tra password nếu đang thay đổi
    if (showChangePassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        setPasswordError("Vui lòng điền đầy đủ thông tin mật khẩu.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setPasswordError(
          "New password và Confirm new password không giống nhau."
        );
        return;
      }
      if (newPassword === currentPassword) {
        setPasswordError("New password không được giống Current password.");
        return;
      }
    }

    setPasswordError("");
    alert("Changes saved successfully!");
    // Ở đây bạn có thể gọi API để lưu profile
  };

  const handleViewDetails = (ticket) => setSelectedTicket(ticket);
  const handleCloseModal = () => setSelectedTicket(null);

  // Ticket card rendering (giữ nguyên từ code cũ)
  const renderTicketCard = (ticket) => (
    <div key={ticket.id} className="ticket-card">
      <div className="ticket-card-content">
        <img
          src={ticket.poster}
          alt={ticket.movie}
          className="ticket-card-img"
        />
        <div>
          <h5 className="ticket-card-title">{ticket.movie}</h5>
          <p>
            <strong>Theater:</strong> {ticket.theater}
          </p>
          <p>
            <strong>Date:</strong> {ticket.date}
          </p>
          <p>
            <strong>Seats:</strong> {ticket.seats.join(", ")}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <button
            className="btn btn-warning mt-2"
            onClick={() => handleViewDetails(ticket)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page-container d-flex">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <h3>My Account</h3>
        <ul>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </li>
          <li
            className={activeTab === "tickets" ? "active" : ""}
            onClick={() => setActiveTab("tickets")}
          >
            🎫 My Tickets
          </li>
          <li
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            🕒 History
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="profile-content flex-grow-1">
        {activeTab === "profile" && (
          <div className="profile-card">
            <div className="profile-header">
              <img
                src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                alt="user avatar"
                className="profile-avatar"
              />
              <div>
                <h3 className="profile-name">{fullName}</h3>
                <p className="profile-email">{email}</p>
              </div>
            </div>

            <hr className="divider" />

            <h4 className="section-title">Account Information</h4>

            {/* FORM PROFILE */}
            <form
              className="profile-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-warning px-4">
                  Save Profile
                </button>
              </div>
            </form>

            {/* PASSWORD */}
            <div className="profile-form">
              <hr className="my-4" />
              <h4 className="section-title">Change Password</h4>

              {!showChangePassword && (
                <div className="text-end mb-3">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </button>
                </div>
              )}

              {showChangePassword && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-danger">{passwordError}</p>
                  )}

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-warning px-4"
                      onClick={handleChangePassword}
                    >
                      Save Password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="user-dashboard-section">
            <h4>🎟️ Current Bookings</h4>
            {tickets.map(renderTicketCard)}
          </div>
        )}

        {activeTab === "history" && (
          <div className="user-dashboard-section">
            <h4>📜 Past Bookings</h4>
            {historyTickets.map(renderTicketCard)}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTicket && (
        <div className="fade-modal show" onClick={handleCloseModal}>
          <div
            className="modal-dialog modal-lg ticket-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content ticket-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title text-warning ticket-modal-title">
                  🎬 {selectedTicket.movie}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body scrollable-modal">
                <div className="ticket-detail-body">
                  <img
                    src={selectedTicket.poster}
                    alt={selectedTicket.movie}
                    className="ticket-detail-img"
                  />
                  <div className="ticket-detail-info">
                    <section>
                      <h6 className="text-warning">Showtime & Movie Details</h6>
                      <p>
                        <strong>Language:</strong> {selectedTicket.language}
                      </p>
                      <p>
                        <strong>Format:</strong> {selectedTicket.format}
                      </p>
                      <p>
                        <strong>Duration:</strong> {selectedTicket.duration}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedTicket.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTicket.time}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Location Details</h6>
                      <p>
                        <strong>Theater:</strong> {selectedTicket.theater}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedTicket.address}
                      </p>
                      <p>
                        <strong>Room:</strong> {selectedTicket.room}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Ticket & Seat Details</h6>
                      <p>
                        <strong>Booking ID:</strong> {selectedTicket.bookingId}
                      </p>
                      <p>
                        <strong>Seat Type:</strong> {selectedTicket.seatType}
                      </p>
                      <p>
                        <strong>Seats:</strong>{" "}
                        {selectedTicket.seats.join(", ")}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {selectedTicket.quantity}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Transaction & Price</h6>
                      <p>
                        <strong>Ticket Price:</strong>{" "}
                        {selectedTicket.ticketPrice?.toLocaleString()}₫
                      </p>
                      <p>
                        <strong>Food & Drinks:</strong>{" "}
                        {selectedTicket.foodPrice?.toLocaleString()}₫
                      </p>
                      <p>
                        <strong>Total:</strong>{" "}
                        {selectedTicket.total?.toLocaleString()}₫
                      </p>
                      <p>
                        <strong>Payment:</strong> {selectedTicket.payment}
                      </p>
                      <p>
                        <strong>Paid At:</strong> {selectedTicket.paidTime}
                      </p>
                      <p>
                        <strong>Status:</strong> ✅ {selectedTicket.status}
                      </p>
                    </section>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary ticket-btn"
                  onClick={handleCloseModal}
                >
                  Close
                </button>

                {activeTab === "tickets" && (
                  <button type="button" className="btn btn-warning ticket-btn">
                    Download E-Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
