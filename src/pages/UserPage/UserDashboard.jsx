import React, { useState } from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: 1,
      movie: "Avatar 5: The Search for More Money",
      poster: "https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc%40._V1_.jpg",
      language: "English, Sub: Vietnamese",
      format: "IMAX 3D",
      duration: "2h 45m",
      date: "Tue, 25 Mar 2026",
      time: "20:45 PM",
      theater: "CGV VivoCity",
      address: "1058 Nguyen Van Linh, District 7, HCMC",
      room: "Screen 4",
      bookingId: "BK2026-AV5-0325",
      seats: ["G1", "G2", "G3"],
      seatType: "Standard",
      quantity: 3,
      ticketPrice: 180000,
      foodPrice: 90000,
      total: 630000,
      payment: "Momo Wallet",
      paidTime: "25 Mar 2026, 18:30",
      status: "Paid",
    },
    {
      id: 2,
      movie: "Avengers: Endgame",
      poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
      language: "English, Sub: Vietnamese",
      format: "2D",
      duration: "3h 1m",
      date: "Fri, 10 Apr 2026",
      time: "19:00 PM",
      theater: "Lotte Cinema Landmark 81",
      address: "720A Dien Bien Phu, Binh Thanh, HCMC",
      room: "Hall 5 (Gold Class)",
      bookingId: "BK2026-END-0410",
      seats: ["C1", "C2"],
      seatType: "Couple",
      quantity: 2,
      ticketPrice: 250000,
      foodPrice: 120000,
      total: 620000,
      payment: "Visa Card",
      paidTime: "10 Apr 2026, 17:20",
      status: "Paid",
    },
  ];

  const historyTickets = [
    {
      id: 3,
      movie: "Inside Out 2",
      theater: "CGV Crescent Mall",
      date: "10 Aug 2025",
      seats: ["F7", "F8"],
      status: "Completed",
    },
  ];

  const handleViewDetails = (ticket) => setSelectedTicket(ticket);
  const handleCloseModal = () => setSelectedTicket(null);

  return (
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <div className="user-dashboard-sidebar">
        <h3 className="user-dashboard-title">My Account</h3>
        <ul>
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
      <div className="user-dashboard-content">
        {activeTab === "tickets" && (
          <div className="user-dashboard-section">
            <h4>🎟️ Current Bookings</h4>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div style={{ display: "flex", gap: "20px" }}>
                  <img
                    src={ticket.poster}
                    alt={ticket.movie}
                    style={{
                      width: "100px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h5>{ticket.movie}</h5>
                    <p><strong>Theater:</strong> {ticket.theater}</p>
                    <p><strong>Date:</strong> {ticket.date}</p>
                    <p><strong>Seats:</strong> {ticket.seats.join(", ")}</p>
                    <button
                      className="btn btn-warning mt-2"
                      onClick={() => handleViewDetails(ticket)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="user-dashboard-section">
            <h4>🎟️ Current Bookings</h4>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div style={{ display: "flex", gap: "20px" }}>
                  <img
                    src={ticket.poster}
                    alt={ticket.movie}
                    style={{
                      width: "100px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h5>{ticket.movie}</h5>
                    <p><strong>Theater:</strong> {ticket.theater}</p>
                    <p><strong>Date:</strong> {ticket.date}</p>
                    <p><strong>Seats:</strong> {ticket.seats.join(", ")}</p>
                    <button
                      className="btn btn-warning mt-2"
                      onClick={() => handleViewDetails(ticket)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <div
              className="modal-content"
              style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title text-warning ticket-modal-title">
                  🎫 Ticket Details - {selectedTicket.movie}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body scrollable-modal">
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <img
                    src={selectedTicket.poster}
                    alt={selectedTicket.movie}
                    style={{
                      width: "160px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h6 className="text-warning">1. Showtime & Movie Details</h6>
                    <p><strong>Language:</strong> {selectedTicket.language}</p>
                    <p><strong>Format:</strong> {selectedTicket.format}</p>
                    <p><strong>Duration:</strong> {selectedTicket.duration}</p>
                    <p><strong>Date:</strong> {selectedTicket.date}</p>
                    <p><strong>Time:</strong> {selectedTicket.time}</p>
                    <hr />

                    <h6 className="text-warning">2. Location Details</h6>
                    <p><strong>Theater:</strong> {selectedTicket.theater}</p>
                    <p><strong>Address:</strong> {selectedTicket.address}</p>
                    <p><strong>Room:</strong> {selectedTicket.room}</p>
                    <hr />

                    <h6 className="text-warning">3. Ticket & Seat Details</h6>
                    <p><strong>Booking ID:</strong> {selectedTicket.bookingId}</p>
                    <p><strong>Seat Type:</strong> {selectedTicket.seatType}</p>
                    <p><strong>Seats:</strong> {selectedTicket.seats.join(", ")}</p>
                    <p><strong>Quantity:</strong> {selectedTicket.quantity}</p>
                    <hr />

                    <h6 className="text-warning">4. Transaction & Price Details</h6>
                    <p><strong>Ticket Price:</strong> {selectedTicket.ticketPrice.toLocaleString()}₫</p>
                    <p><strong>Food & Drinks:</strong> {selectedTicket.foodPrice.toLocaleString()}₫</p>
                    <p><strong>Total:</strong> {selectedTicket.total.toLocaleString()}₫</p>
                    <p><strong>Payment Method:</strong> {selectedTicket.payment}</p>
                    <p><strong>Paid At:</strong> {selectedTicket.paidTime}</p>
                    <p><strong>Status:</strong> ✅ {selectedTicket.status}</p>
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
                <button type="button" className="btn btn-warning ticket-btn">
                  Download E-Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
