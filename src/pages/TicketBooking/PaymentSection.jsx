import React, { useState } from "react";
import "./PaymentSection.css"; // dùng lại CSS cho đồng bộ giao diện

export default function PaymentSection({
  movieTitle,
  selectedShowtime,
  selectedSeats = [],
  seatTotal = 0,
  selectedFoods = [],
  foodTotal = 0,
  onBack, // callback quay lại
  onFinish, // callback sau khi thanh toán xong (ví dụ về trang chủ)
}) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
  });

  const total = seatTotal + foodTotal;

  const generateTicketCode = () => {
    const code = "V" + Math.floor(100000 + Math.random() * 900000);
    setTicketCode(code);
    return code;
  };

  const handleConfirmPayment = () => {
    const code = generateTicketCode();
    setIsPaid(true);
    alert("🎉 Thanh toán thành công!");
    console.log("Thanh toán thành công:", {
      movieTitle,
      selectedShowtime,
      selectedSeats,
      selectedFoods,
      total,
      paymentMethod,
      formData,
      ticketCode: code,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="total-summary">
      <h4>Phương thức thanh toán</h4>

      <p>
        <strong>Phim:</strong> {movieTitle}
      </p>
      <p>{selectedShowtime
    ? `${selectedShowtime.start_time} - ${selectedShowtime.end_time}`
    : "Chưa chọn"}
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
        Tổng cộng: {total.toLocaleString("vi-VN")} VND
      </h4>

      {/* --- Nếu chưa chọn phương thức --- */}
      {!paymentMethod && !isPaid && (
        <div className="payment-buttons">
          <button className="payment-button" onClick={() => setPaymentMethod("qr")}>
            💳 Quét mã QR
          </button>
          <button className="payment-button" onClick={() => setPaymentMethod("form")}>
            🧾 Nhập thông tin thanh toán
          </button>
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Quay lại
            </button>
          )}
        </div>
      )}

      {/* --- Thanh toán bằng QR --- */}
      {paymentMethod === "qr" && !isPaid && (
        <div className="payment-method">
          <h5>Quét mã QR để thanh toán</h5>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Thanh toán ${total} VND`}
            alt="Fake QR"
            style={{ margin: "10px auto", display: "block" }}
          />
          <p>Quét mã bằng ứng dụng ngân hàng của bạn</p>
          <button className="payment-button" onClick={handleConfirmPayment}>
            ✅ Xác nhận đã thanh toán
          </button>
          <button className="back-button" onClick={() => setPaymentMethod("")}>
            ← Chọn lại phương thức
          </button>
        </div>
      )}

      {/* --- Thanh toán thủ công --- */}
      {paymentMethod === "form" && !isPaid && (
        <div className="payment-method">
          <h5>Nhập thông tin thanh toán</h5>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="form-group">
            <label>Email nhận vé:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
          </div>
          <div className="form-group">
            <label>Số thẻ (giả lập):</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <button className="payment-button" onClick={handleConfirmPayment}>
            💰 Xác nhận thanh toán
          </button>
          <button className="back-button" onClick={() => setPaymentMethod("")}>
            ← Chọn lại phương thức
          </button>
        </div>
      )}

      {/* --- Hiển thị mã vé sau thanh toán --- */}
      {isPaid && (
        <div className="ticket-section">
          <h4>🎟️ Vé điện tử của bạn</h4>
          <p>
            <strong>Mã vé:</strong> <span style={{ color: "#28a745" }}>{ticketCode}</span>
          </p>
          <p>
            <strong>Phim:</strong> {movieTitle}
          </p>
          <p>
            <strong>Suất chiếu:</strong> {selectedShowtime.start_time} -{" "}
            {selectedShowtime.end_time}
          </p>
          <p>
            <strong>Ghế:</strong> {selectedSeats.join(", ")}
          </p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Vé ${ticketCode} - ${movieTitle}`}
            alt="QR Ticket"
            style={{ margin: "10px auto", display: "block" }}
          />
          <p>Quét mã QR tại rạp để nhận vé giấy 🎫</p>

          <button className="payment-button" onClick={onFinish}>
            🏠 Hoàn tất / Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
}
