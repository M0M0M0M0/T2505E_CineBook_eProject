import React, { useState } from "react";
import "./BookingSection.css";
import { div } from "framer-motion/client";

export default function BookingSection({ movieTitle }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = {
    A: Array(10).fill("standard"),
    B: Array(10).fill("standard"),
    C: Array(10).fill("vip"),
    D: Array(10).fill("vip"),
    E: Array(10).fill("standard"),
    F: Array(6).fill("couple"),
  };

  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const total = selectedSeats.reduce((sum, seat) => {
    if (seat.startsWith("C") || seat.startsWith("D")) return sum + 101000; // VIP
    if (seat.startsWith("F")) return sum + 212000 / 2; // Couple (chia đôi)
    return sum + 93000; // Standard
  }, 0);

  return (
    <div className="booking-section">
      <h2>🎟 Đặt vé cho: {movieTitle}</h2>

      <div className="screen">Màn hình</div>

      <div className="seat-map">
        {Object.entries(seats).map(([row, seatsInRow]) => (

          <div className="seat-row" key={row}>
            <span className="seat-row-label">{row}</span>
            {seatsInRow.map((type, i) => {
              const seatId = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seatId);
              return (
                <div
                  key={seatId}
                  className={`seat ${type} ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSeat(row, i)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          
          
        ))}
      </div>

      <div className="booking-summary">
        <h4>Tóm tắt đặt vé</h4>
        <p>Ghế đã chọn: {selectedSeats.join(", ") || "Chưa chọn"}</p>
        <p>Tổng tiền: {total.toLocaleString("vi-VN")} VND</p>
        <button disabled={!selectedSeats.length}>Tiếp tục</button>
      </div>
    </div>
  );
}
