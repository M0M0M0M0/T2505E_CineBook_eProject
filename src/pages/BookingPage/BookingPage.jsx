import React, { useState } from "react";
import "./BookingPage.css";

const BookingPage = () => {
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [showTicket, setShowTicket] = useState(false);
  const [userName] = useState("Conner Berry");

  const seatTypes = {
    standard: ["A", "B", "C", "D", "G", "H", "I", "J"],
    vip: ["E", "F"],
    couple: ["K"],
  };

  const seatPrices = {
    standard: 7.5,
    vip: 10.0,
    couple: 15.0,
  };

  const soldSeats = ["E4", "F3", "H2"];

  const getSeatType = (row) => {
    if (seatTypes.vip.includes(row)) return "vip";
    if (seatTypes.couple.includes(row)) return "couple";
    return "standard";
  };

  const toggleSeat = (seat) => {
    if (soldSeats.includes(seat)) return;
    if (selectedSeat.includes(seat)) {
      setSelectedSeat(selectedSeat.filter((s) => s !== seat));
    } else {
      setSelectedSeat([...selectedSeat, seat]);
    }
  };

  const renderSeats = () => {
    const rows = [];
    for (let row of [
      ...seatTypes.standard,
      ...seatTypes.vip,
      ...seatTypes.couple,
    ]) {
      const seats = [];
      const totalSeats = row === "K" ? 10 : 12;
      for (let i = 1; i <= totalSeats; i++) {
        const seatId = `${row}${i}`;
        const type = getSeatType(row);
        const status = soldSeats.includes(seatId)
          ? "sold"
          : selectedSeat.includes(seatId)
          ? "selected"
          : "";

        seats.push(
          <div
            key={seatId}
            className={`seat ${type} ${status}`}
            onClick={() => toggleSeat(seatId)}
          >
            {seatId}
          </div>
        );
      }
      rows.push(
        <div key={row} className="seat-row">
          <span className="row-label">{row}</span>
          {seats}
          <span className="row-label">{row}</span>
        </div>
      );
    }
    return rows;
  };

  const calculateTotal = () => {
    return selectedSeat.reduce((total, seat) => {
      const row = seat.charAt(0);
      const type = getSeatType(row);
      return total + seatPrices[type];
    }, 0);
  };

  const handleConfirm = () => {
    if (selectedSeat.length === 0) {
      alert("Please select at least one seat before confirming!");
      return;
    }
    setShowTicket(true);
  };

  const totalPrice = calculateTotal().toFixed(2);
  const movieName = "Avengers: Endgame";
  const theater = "CGV Vincom Ba Trieu";
  const showtime = "7:30 PM – 9:45 PM | Oct 25, 2025";
  const coupon = "SAVE10";

  return (
    <div className="booking-page container py-5">
      <div className="booking-card shadow-lg rounded-4 bg-white p-4">
        <h3 className="text-center mb-4 fw-bold">🎬 Movie Ticket Booking</h3>

        <div className="movie-info mb-4">
          <h5 className="fw-semibold">
            Movie: <span className="text-primary">{movieName}</span>
          </h5>
          <p>Theater: {theater}</p>
          <p>Showtime: {showtime}</p>
        </div>

        <div className="screen">Màn hình</div>

        <div className="seat-map mb-4">{renderSeats()}</div>

        <div className="legend">
          <div><span className="legend-box standard"></span> Standard ($7.5)</div>
          <div><span className="legend-box vip"></span> VIP ($10)</div>
          <div><span className="legend-box couple"></span> Couple ($15)</div>
          <div><span className="legend-box selected"></span> Ghế đã chọn</div>
          <div><span className="legend-box sold"></span> Ghế đã bán</div>
        </div>

        <div className="summary mt-4">
          <h6 className="fw-semibold">Selected Seats:</h6>
          <p>{selectedSeat.join(", ") || "No seats selected"}</p>
          <h6 className="fw-semibold mt-3">Total Price:</h6>
          <p>{totalPrice} USD</p>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-5 py-2" onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>

      {/* 🎟️ Ticket Popup */}
      {showTicket && (
        <div className="ticket-overlay">
          <div className="ticket-popup">
            <h4 className="ticket-title">🎟️ Booking Confirmed!</h4>
            <div className="ticket-body">
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Movie:</strong> {movieName}</p>
              <p><strong>Date:</strong> {showtime}</p>
              <p><strong>Seats:</strong> {selectedSeat.join(", ")}</p>
              <p><strong>Total:</strong> {totalPrice} USD</p>
              <p><strong>Coupon:</strong> {coupon}</p>
            </div>
            <div className="ticket-footer">
              <button
                className="btn btn-success"
                onClick={() => setShowTicket(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

