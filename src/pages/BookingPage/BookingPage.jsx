import React, { useState } from "react";
import "./BookingPage.css";

const BookingPage = () => {
  const [selectedSeat, setSelectedSeat] = useState([]);

  const toggleSeat = (seat) => {
    if (selectedSeat.includes(seat)) {
      setSelectedSeat(selectedSeat.filter((s) => s !== seat));
    } else {
      setSelectedSeat([...selectedSeat, seat]);
    }
  };

  const seats = [
    "A1","A2","A3","A4","A5",
    "B1","B2","B3","B4","B5",
    "C1","C2","C3","C4","C5",
  ];

  return (
    <div className="booking-page container py-5">
      <div className="booking-card shadow-lg rounded-4 bg-white p-4">
        <h3 className="text-center mb-4 fw-bold">🎬 Movie Ticket Booking</h3>

        {/* Movie Info */}
        <div className="movie-info mb-4">
          <h5 className="fw-semibold">
            Movie: <span className="text-primary">Avengers: Endgame</span>
          </h5>
          <p>Theater: CGV Vincom Ba Trieu</p>
          <p>Showtime: 7:30 PM – 9:45 PM | Date: Oct 25, 2025</p>
        </div>

        {/* Seat Map */}
        <div className="seat-map mb-4">
          {seats.map((seat) => (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              className={`seat-btn ${
                selectedSeat.includes(seat) ? "selected" : ""
              }`}
            >
              {seat}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="summary mt-4">
          <h6 className="fw-semibold">Selected Seats:</h6>
          <p>{selectedSeat.join(", ") || "No seats selected"}</p>
          <h6 className="fw-semibold mt-3">Total Price:</h6>
          <p>{selectedSeat.length * 7.5} USD</p>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-5 py-2">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
