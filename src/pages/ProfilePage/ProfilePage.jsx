import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  const [tickets, setTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

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
  const navigate = useNavigate();
  const location = useLocation();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ HELPER FUNCTION: Convert UTC time to Vietnam local time
  const formatDateTimeVN = (utcTimeString) => {
    if (!utcTimeString) return "N/A";

    try {
      const date = new Date(utcTimeString);

      // Format: DD/MM/YYYY HH:MM
      return date.toLocaleString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (err) {
      console.error("Error formatting time:", err);
      return utcTimeString;
    }
  };

  // ✅ HELPER FUNCTION: Format only date
  const formatDateVN = (utcTimeString) => {
    if (!utcTimeString) return "N/A";

    try {
      const date = new Date(utcTimeString);

      // Format: DD/MM/YYYY
      return date.toLocaleDateString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return utcTimeString;
    }
  };

  // ✅ HELPER FUNCTION: Calculate remaining time
  const getRemainingTime = (expiresAt) => {
    if (!expiresAt) return null;

    try {
      const expiry = new Date(expiresAt);
      const now = new Date();
      const diffMs = expiry - now;

      if (diffMs <= 0) return "Expired";

      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);

      return `${minutes}m ${seconds}s left`;
    } catch (err) {
      console.error("Error calculating time:", err);
      return null;
    }
  };

  // ✅ THÊM: Đọc query parameter để mở tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");

    if (tabParam && ["profile", "tickets", "history"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // ✅ Load user profile
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user-profile", axiosConfig)
      .then((res) => {
        const user = res.data.user;
        setFullName(user.full_name ?? "");
        let formattedDob = "";
        if (user.date_of_birth) {
          formattedDob = user.date_of_birth.split("T")[0];
        }
        setDob(formattedDob);
        setPhone(user.phone_number ?? "");
        setAddress(user.address ?? "");
        setEmail(user.email ?? "");
      })
      .catch(console.log);
  }, [token]);

  // ✅ Load user bookings
  const loadBookings = () => {
    if (!token) return;

    setLoadingTickets(true);
    axios
      .get("http://127.0.0.1:8000/api/user/bookings", axiosConfig)
      .then((res) => {
        if (res.data.success) {
          setTickets(res.data.data.current_bookings || []);
          setHistoryTickets(res.data.data.history_bookings || []);
        }
      })
      .catch((err) => {
        console.error("Error loading bookings:", err);
      })
      .finally(() => {
        setLoadingTickets(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, [token]);

  // ✅ Generate QR Code when viewing ticket details
  useEffect(() => {
    if (selectedTicket) {
      const qrData = JSON.stringify({
        booking_id: selectedTicket.booking_id,
        movie: selectedTicket.movie_title,
        seats: selectedTicket.seats,
        showtime: selectedTicket.showtime_full,
        theater: selectedTicket.theater_name,
      });

      QRCode.toDataURL(qrData, { width: 200, margin: 2 })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    } else {
      setQrCodeDataUrl("");
    }
  }, [selectedTicket]);

  const handleSaveProfile = () => {
    axios
      .patch(
        "http://127.0.0.1:8000/api/user-profile",
        {
          full_name: fullName,
          date_of_birth: dob,
          phone_number: phone,
          address,
        },
        axiosConfig
      )
      .then((res) => alert("Profile updated successfully"))
      .catch((err) => console.log(err));
  };

  const handleChangePassword = () => {
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

    setPasswordError("");

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
      .then((res) => {
        alert(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowChangePassword(false);
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          setPasswordError(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  const handleContinueBooking = async (ticket) => {
    let nextStep = "food";

    if (ticket.next_step) {
      nextStep = ticket.next_step;
    } else if (ticket.has_foods) {
      nextStep = "payment";
    } else if (ticket.foods && ticket.foods.length > 0) {
      nextStep = "payment";
    }

    // console.log("🔍 Continuing booking to step:", nextStep);
    // console.log("📦 Ticket data:", ticket);

    // ✅ TÍNH LẠI SEAT TOTAL NẾU = 0
    let seatTotal = ticket.ticket_total || 0;

    if (seatTotal === 0 && ticket.seats && ticket.seats.length > 0) {
      // console.log("⚠️ Seat total is 0, recalculating...");
      seatTotal = await calculateSeatTotal(ticket.seats, ticket.showtime_id);
      // console.log("✅ Recalculated seat total:", seatTotal);
    }

    // Navigate to movie detail page với thông tin resume
    navigate(`/movie/${ticket.movie_id}`, {
      state: {
        resumeBooking: true,
        bookingId: ticket.booking_id,
        showtimeId: ticket.showtime_id,
        targetStep: nextStep,
        seats: ticket.seats || [],
        seatTotal: seatTotal, // ✅ SỬ DỤNG GIÁ TRỊ ĐÃ TÍNH
        foods: ticket.foods || [],
        foodTotal: ticket.food_total || 0,
      },
    });
  };

  //Cancel pending booking
  const handleCancelBooking = async (ticket) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings/cancel",
        {
          booking_id: ticket.booking_id,
        },
        axiosConfig
      );

      if (response.data.success) {
        alert("Booking cancelled successfully");

        // Reload bookings
        loadBookings();

        // Close modal if currently viewing this ticket
        if (selectedTicket?.booking_id === ticket.booking_id) {
          handleCloseModal();
        }
      } else {
        alert(response.data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while cancelling the booking"
      );
    }
  };

  const handleViewDetails = (ticket) => setSelectedTicket(ticket);
  const handleCloseModal = () => {
    setSelectedTicket(null);
    setQrCodeDataUrl("");
  };

  // ✅ Download E-Ticket as image
  const handleDownloadTicket = () => {
    if (!qrCodeDataUrl || !selectedTicket) return;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffc107";
    ctx.font = "bold 24px Arial";
    ctx.fillText("E-TICKET", 20, 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(selectedTicket.movie_title, 20, 80);

    ctx.font = "16px Arial";
    let y = 120;
    const lineHeight = 30;

    const details = [
      `Theater: ${selectedTicket.theater_name}`,
      `Date: ${selectedTicket.showtime_date}`,
      `Time: ${selectedTicket.showtime_time}`,
      `Room: ${selectedTicket.room_name}`,
      `Seats: ${selectedTicket.seats.join(", ")}`,
      `Booking ID: ${selectedTicket.booking_id}`,
      `Total: $${selectedTicket.grand_total}`,
    ];

    details.forEach((text) => {
      ctx.fillText(text, 20, y);
      y += lineHeight;
    });

    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 200, 400, 200, 200);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${selectedTicket.booking_id}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    qrImage.src = qrCodeDataUrl;
  };
  const calculateSeatTotal = async (seats, showtimeId) => {
    if (!seats || seats.length === 0) return 0;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/showtimes/${showtimeId}/sold-seats`
      );

      if (!response.ok) throw new Error("Failed to fetch seat prices");

      const result = await response.json();
      const seatPrices = result.data.seat_type_prices || {};

      const SEAT_TYPE_MAP = {
        A: "Standard",
        B: "Gold",
        C: "Gold",
        D: "Gold",
        E: "Gold",
        F: "Gold",
        G: "Box (Couple)",
      };

      let total = 0;

      seats.forEach((seatCode) => {
        const row = seatCode[0];
        const col = parseInt(seatCode.substring(1));

        let seatType = SEAT_TYPE_MAP[row];

        // Xử lý các ghế đặc biệt
        if (
          row === "B" &&
          (col === 1 || col === 2 || col === 15 || col === 16)
        ) {
          seatType = "Standard";
        }

        if (["C", "D", "E"].includes(row) && col >= 3 && col <= 14) {
          seatType = "Platinum";
        }

        const priceData = seatPrices[seatType];
        const price = priceData ? parseFloat(priceData.seat_type_price) : 0;

        // console.log(`💺 ${seatCode}: ${seatType} = $${price}`);

        total += price;
      });

      return total;
    } catch (err) {
      console.error("Error calculating seat total:", err);
      return 0;
    }
  };

  // ✅ CẬP NHẬT: Render ticket card với format thời gian VN
  const renderTicketCard = (ticket) => (
    <div key={ticket.booking_id} className="ticket-card">
      <div className="ticket-card-content">
        <img
          src={ticket.poster || "https://via.placeholder.com/150"}
          alt={ticket.movie_title}
          className="ticket-card-img"
        />
        <div>
          <h5 className="ticket-card-title">{ticket.movie_title}</h5>
          <p>
            <strong>Theater:</strong> {ticket.theater_name}
          </p>
          <p>
            <strong>Date:</strong> {ticket.showtime_date} {ticket.showtime_time}
          </p>
          <p>
            <strong>Seats:</strong> {ticket.seats.join(", ")}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                ticket.status === "completed" ? "bg-success" : "bg-warning"
              }`}
            >
              {ticket.status === "completed" ? "✅ Confirmed" : "⏳ Pending"}
            </span>
            {/* ✅ Hiển thị thời gian còn lại với VN timezone */}
            {ticket.status === "pending" && ticket.expires_at && (
              <span className="ms-2 text-white small">
                (Expires: {formatDateTimeVN(ticket.expires_at)})
              </span>
            )}
          </p>

          {/* ✅ BUTTONS: Khác nhau tùy theo status */}
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleViewDetails(ticket)}
            >
              View Details
            </button>

            {/* ✅ NÚT CHO PENDING BOOKINGS */}
            {ticket.status === "pending" && !ticket.is_expired && (
              <>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleContinueBooking(ticket)}
                >
                  Continue Booking
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCancelBooking(ticket)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
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

            {/* PASSWORD SECTION */}
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
                      className="btn btn-warning px-4 me-2"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordError("");
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                      }}
                    >
                      Cancel
                    </button>
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
            {loadingTickets ? (
              <p>Loading tickets...</p>
            ) : tickets.length > 0 ? (
              tickets.map(renderTicketCard)
            ) : (
              <p className="text-white">No current bookings</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="user-dashboard-section">
            <h4>📜 Past Bookings</h4>
            {loadingTickets ? (
              <p>Loading history...</p>
            ) : historyTickets.length > 0 ? (
              historyTickets.map(renderTicketCard)
            ) : (
              <p className="text-white">No past bookings</p>
            )}
          </div>
        )}
      </div>

      {/* Modal - ✅ CẬP NHẬT với format thời gian VN */}
      {selectedTicket && (
        <div className="fade-modal show" onClick={handleCloseModal}>
          <div
            className="modal-dialog modal-lg ticket-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content ticket-modal">
              <div className="modal-header border-0">
                <h5 className="modal-title text-warning ticket-modal-title">
                  🎬 {selectedTicket.movie_title}
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
                    src={
                      selectedTicket.poster ||
                      "https://via.placeholder.com/300x450"
                    }
                    alt={selectedTicket.movie_title}
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
                        <strong>Date:</strong> {selectedTicket.showtime_date}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTicket.showtime_time}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Location Details</h6>
                      <p>
                        <strong>Theater:</strong> {selectedTicket.theater_name}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedTicket.theater_address}
                      </p>
                      <p>
                        <strong>Room:</strong> {selectedTicket.room_name}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Ticket & Seat Details</h6>
                      <p>
                        <strong>Booking ID:</strong> {selectedTicket.booking_id}
                      </p>
                      <p>
                        <strong>Seat Types:</strong>{" "}
                        {selectedTicket.seat_types?.join(", ") || "N/A"}
                      </p>
                      <p>
                        <strong>Seats:</strong>{" "}
                        {selectedTicket.seats.join(", ")}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {selectedTicket.seats.length}
                      </p>
                    </section>
                    <hr />
                    <section>
                      <h6 className="text-warning">Transaction & Price</h6>
                      <p>
                        <strong>Ticket Price:</strong> $
                        {selectedTicket.ticket_total?.toLocaleString()}
                      </p>
                      <p>
                        <strong>Food & Drinks:</strong> $
                        {selectedTicket.food_total?.toLocaleString()}
                      </p>
                      <p>
                        <strong>Total:</strong> $
                        {selectedTicket.grand_total?.toLocaleString()}
                      </p>
                      <p>
                        <strong>Payment:</strong>{" "}
                        {selectedTicket.payment_method}
                      </p>
                      <p>
                        <strong>Booked At:</strong>{" "}
                        {formatDateTimeVN(selectedTicket.created_at)}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {selectedTicket.status === "completed" ? "✅" : "⏳"}{" "}
                        {selectedTicket.status}
                      </p>
                      {/* ✅ Hiển thị expires_at cho pending bookings */}
                      {selectedTicket.status === "pending" &&
                        selectedTicket.expires_at && (
                          <p>
                            <strong>Expires At:</strong>{" "}
                            {formatDateTimeVN(selectedTicket.expires_at)}
                          </p>
                        )}
                    </section>
                    <hr />
                    {/* QR CODE SECTION */}
                    <section className="text-center">
                      <h6 className="text-warning">E-Ticket QR Code</h6>
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code"
                          style={{
                            maxWidth: "200px",
                            margin: "10px auto",
                            display: "block",
                          }}
                        />
                      ) : (
                        <p>Generating QR code...</p>
                      )}
                      <p className="small text-white">
                        Scan this QR code at the theater entrance
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

                {/* ✅ BUTTONS TRONG MODAL */}
                {selectedTicket.status === "pending" &&
                  !selectedTicket.is_expired && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success ticket-btn"
                        onClick={() => handleContinueBooking(selectedTicket)}
                      >
                        Continue Booking
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger ticket-btn"
                        onClick={() => handleCancelBooking(selectedTicket)}
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}

                {selectedTicket.status === "completed" && (
                  <button
                    type="button"
                    className="btn btn-warning ticket-btn"
                    onClick={handleDownloadTicket}
                  >
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
