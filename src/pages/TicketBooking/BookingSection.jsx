import React, { useState } from "react";
import "./BookingSection.css";

export default function BookingSection({
  movieTitle,
  selectedSeats,
  setSelectedSeats,
  onSelectSeats,
  onBack,
}) {
  const seats = {
    A: Array(16).fill("standard"),
    B: Array(16).fill("gold"),
    C: Array(16).fill("gold"),
    D: Array(16).fill("gold"),
    E: Array(16).fill("gold"),
    F: Array(16).fill("gold"),
    G: Array(16).fill("box"),
  };

  seats.B[0] = "standard";
  seats.B[1] = "standard";
  seats.B[14] = "standard";
  seats.B[15] = "standard";

  ["C", "D", "E"].forEach((row) => {
    for (let i = 2; i <= 13; i++) {
      seats[row][i] = "platinum";
    }
  });

  const soldSeats = ["A3", "C8", "D9", "G9", "G10"];

  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;
    if (soldSeats.includes(seatId)) return;

    if (seats[row][index] === "box") {
      const pairSeatId =
        index % 2 === 0 ? `${row}${index + 2}` : `${row}${index}`;
      const seatsToToggle = [seatId, pairSeatId];
      const allSelected = seatsToToggle.every((s) => selectedSeats.includes(s));
      if (allSelected) {
        setSelectedSeats((prev) =>
          prev.filter((s) => !seatsToToggle.includes(s))
        );
      } else {
        setSelectedSeats((prev) => [...new Set([...prev, ...seatsToToggle])]);
      }
    } else {
      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((s) => s !== seatId)
          : [...prev, seatId]
      );
    }
  };

  const total = selectedSeats.reduce((sum, seat) => {
    if (seat.startsWith("A") || seat.startsWith("B")) return sum + 100000;
    if (seat.match(/^([C-E])/)) return sum + 150000;
    if (seat.match(/^F/)) return sum + 120000;
    if (seat.startsWith("G")) return sum + 250000;
    return sum;
  }, 0);

  const handleContinue = () => {
    if (!selectedSeats.length) {
      alert("Please select seats before continuing!");
      return;
    }
    onSelectSeats({ seats: selectedSeats, total });
  };

  return (
    <div className="booking-section">
      <div className="screen">SCREEN</div>

      <div className="seat-map">
        {Object.entries(seats).map(([row, seatsInRow]) => (
          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            <div className="seat-row-wrapper">
              {seatsInRow.map((type, i) => {
                const seatId = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isSold = soldSeats.includes(seatId);
                return (
                  <div
                    key={seatId}
                    className={`seat ${type} ${isSelected ? "selected" : ""} ${
                      isSold ? "sold" : ""
                    }`}
                    onClick={() => toggleSeat(row, i)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div>
          <span className="legend-box standard"></span>Standard
        </div>
        <div>
          <span className="legend-box gold"></span>Gold
        </div>
        <div>
          <span className="legend-box platinum"></span>Platinum
        </div>
        <div>
          <span className="legend-box box"></span>Box (Couple)
        </div>
        <div>
          <span className="legend-box selected"></span>Selected
        </div>
        <div>
          <span className="legend-box sold"></span>Sold
        </div>
      </div>

      <div className="booking-summary">
        <h4>Booking Summary</h4>
        <p>Selected seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Total: {total.toLocaleString("vi-VN")} VND</p>

        <div className="total-buttons">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back
            </button>
          )}

          <button className="total-button" onClick={handleContinue}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
