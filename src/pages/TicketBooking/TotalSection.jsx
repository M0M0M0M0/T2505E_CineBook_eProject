import React from "react";
import "./TotalSection.css";

export default function TotalSection({
  movieTitle,
  selectedShowtime,
  selectedSeats = [],
  seatTotal = 0,
  selectedFoods = [],
  foodTotal = 0,
  onBack, // callback quay lại
  onNext, // ✅ callback sang bước thanh toán
}) {
  const handleTotal = () => {
    console.log("Tổng thanh toán:", {
      movieTitle,
      selectedShowtime,
      selectedSeats,
      selectedFoods,
      seatTotal,
      foodTotal,
      total: seatTotal + foodTotal,
    });

    if (onNext) onNext(); // ✅ chuyển sang bước thanh toán
  };

  return (
    <div className="total-summary">
      <h4>Movie Ticket Payment</h4>

      <p>
        <strong>Movie:</strong> {movieTitle}
      </p>
      <p>
        <strong>Showtime:</strong>{" "}
        {selectedShowtime
          ? `${selectedShowtime.start_time} - ${selectedShowtime.end_time}`
          : "Not selected"}
      </p>

      <h5>Selected Seats</h5>
      {selectedSeats.length > 0 ? (
        <ul className="seat-list">
          {selectedSeats.map((seat) => (
            <li key={seat}>{seat}</li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
      <p>
        <strong>Seat total:</strong> ${seatTotal.toLocaleString("vi-VN")}
      </p>

      <h5>Selected Foods</h5>
      {Object.keys(selectedFoods).length > 0 ? (
        <ul className="food-list">
          {Object.entries(selectedFoods).map(([name, quantity]) => (
            <li key={name}>
              {name} x {quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
      <p>
        <strong>Food total:</strong> ${foodTotal.toLocaleString("vi-VN")} 
      </p>

      <h4 className="total-amount">
        Grand total: ${(seatTotal + foodTotal).toLocaleString("vi-VN")}
      </h4>

      <div className="total-buttons">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}
        <button className="total-button" onClick={handleTotal}>
          Confirm
        </button>
      </div>
    </div>
  );
}
