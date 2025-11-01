import React from "react";
import "./PaymentSection.css";

export default function PaymentSection({
  movieTitle,
  selectedShowtime,
  selectedSeats = [],
  seatTotal = 0,
  selectedFoods = [],
  foodTotal = 0,
  onBack, // thêm prop callback quay lại
}) {
  const handlePayment = () => {
    console.log("Thanh toán:", {
      movieTitle,
      selectedShowtime,
      selectedSeats,
      selectedFoods,
      seatTotal,
      foodTotal,
      total: seatTotal + foodTotal,
    });
    alert(
      `Thanh toán thành công! Tổng: ${(seatTotal + foodTotal).toLocaleString(
        "vi-VN"
      )} VND`
    );
  };

  return (
    <div className="payment-summary">
      <h4>Thanh toán vé phim</h4>

      <p>
        <strong>Phim:</strong> {movieTitle}
      </p>
      <p>
        Suất chiếu: {selectedShowtime.start_time} - {selectedShowtime.end_time}
      </p>

      <h5>Ghế đã chọn</h5>
      {selectedSeats.length > 0 ? (
        <ul className="seat-list">
          {selectedSeats.map((seat) => (
            <li key={seat}>{seat}</li>
          ))}
        </ul>
      ) : (
        <p>Chưa chọn ghế</p>
      )}
      <p>
        <strong>Tổng tiền ghế:</strong> {seatTotal.toLocaleString("vi-VN")} VND
      </p>

      <h5>Đồ ăn đã chọn</h5>
      {selectedFoods.length > 0 ? (
        <ul className="food-list">
          {selectedFoods.map((food) => (
            <li key={food}>{food}</li>
          ))}
        </ul>
      ) : (
        <p>Không có</p>
      )}
      <p>
        <strong>Tổng tiền đồ ăn:</strong> {foodTotal.toLocaleString("vi-VN")}{" "}
        VND
      </p>

      <h4 className="total-amount">
        Tổng cộng: {(seatTotal + foodTotal).toLocaleString("vi-VN")} VND
      </h4>

      <div className="payment-buttons">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Quay lại
          </button>
        )}
        <button className="payment-button" onClick={handlePayment}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}
