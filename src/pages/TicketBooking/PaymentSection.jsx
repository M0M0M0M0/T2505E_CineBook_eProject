import React, { useState } from "react";
import "./TotalSection.css"; // dùng lại CSS cho đồng bộ giao diện

export default function PaymentSection({
  movieTitle,
  selectedShowtime,
  selectedSeats = [],
  seatTotal = 0, // ⬅️ ĐÃ LÀ USD
  selectedFoods = [],
  foodTotal = 0, // ⬅️ ĐÃ LÀ USD
  onBack,
  onFinish,
  bookingId, // ⬅️ THÊM PROP MỚI: Nhận Booking ID
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ⬅️ THÊM HÀM MỚI: GỌI API FINALIZE PAYMENT
  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    if (!bookingId) {
      alert("Lỗi: Booking ID không tìm thấy. Không thể hoàn tất thanh toán.");
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    console.log("🔍 DEBUG Payment - Token:", token);
    console.log("🔍 DEBUG Payment - Booking ID:", bookingId);

    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      return;
    }

    // Gọi API finalizePayment
    try {
      const requestBody = {
        booking_id: bookingId,
        seat_codes: selectedSeats, // ⬅️ THÊM seat_codes (backend có thể cần)
      };

      console.log("🔍 DEBUG Payment - Request body:", requestBody);

      const response = await fetch(
        "http://127.0.0.1:8000/api/bookings/finalize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ⬅️ GỬI TOKEN
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("🔍 DEBUG Payment - Response status:", response.status);

      const result = await response.json();
      console.log("🔍 DEBUG Payment - Response data:", result);

      if (response.ok && result.success) {
        const code = generateTicketCode();
        setIsPaid(true);
        alert(
          `🎉 Thanh toán thành công! Tổng tiền: $${total.toLocaleString(
            "en-US"
          )}`
        );
        console.log("Finalized booking:", result);

        // Không gọi onFinish ngay, để hiển thị ticket trước
      } else {
        alert(result.message || "Thanh toán thất bại hoặc Booking đã hết hạn.");
      }
    } catch (error) {
      console.error("Lỗi hoàn tất thanh toán:", error);
      alert("Đã xảy ra lỗi không mong muốn khi thanh toán.");
    }
  };

  return (
    <div className="total-summary">
      <h4>Payment Method</h4>

      <p>
        <strong>Movie:</strong> {movieTitle}
      </p>
      <p>
        <strong>Showtime: </strong>
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
        <strong>Seat total:</strong> ${seatTotal.toLocaleString("en-US")}
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
        <strong>Food total:</strong> ${foodTotal.toLocaleString("en-US")}
      </p>

      <h4 className="total-amount">
        Grand total: ${total.toLocaleString("en-US")}
      </h4>

      {/* --- If no payment method selected --- */}
      {!paymentMethod && !isPaid && (
        <div className="payment-buttons">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back
            </button>
          )}
          <button
            className="payment-button"
            onClick={() => setPaymentMethod("qr")}
          >
            💳 Pay with QR code
          </button>
          <button
            className="payment-button"
            onClick={() => setPaymentMethod("form")}
          >
            🧾 Pay with Debit Card
          </button>
        </div>
      )}

      {/* --- Pay with QR --- */}
      {paymentMethod === "qr" && !isPaid && (
        <div className="payment-method">
          <h5>Scan QR code to pay</h5>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Pay $${total}`}
            alt="Fake QR"
            style={{ margin: "10px auto", display: "block" }}
          />
          <p>Scan the code with your banking app</p>
          <div className="total-buttons">
            <button
              className="back-button"
              onClick={() => setPaymentMethod("")}
            >
              ← Back
            </button>
            <button className="total-button" onClick={handleConfirmPayment}>
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* --- Pay with card --- */}
      {paymentMethod === "form" && !isPaid && (
        <div className="payment-method card-payment-layout">
          <div className="card-form">
            <h5>Enter payment information</h5>
            <div className="form-group">
              <label>Full name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                autoComplete="cc-name"
              />
            </div>
            <div className="form-group">
              <label>Email for ticket:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Card number:</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
                maxLength={19}
              />
            </div>
            <div className="total-buttons">
              <button
                className="back-button"
                onClick={() => setPaymentMethod("")}
              >
                ← Back
              </button>
              <button className="total-button" onClick={handleConfirmPayment}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Show ticket code after payment --- */}
      {isPaid && (
        <div className="ticket-section">
          <h4>🎟️ Your E-Ticket</h4>
          <p>
            <strong>Ticket code:</strong>{" "}
            <span style={{ color: "#28a745" }}>{ticketCode}</span>
          </p>
          <p>
            <strong>Movie:</strong> {movieTitle}
          </p>
          <p>
            <strong>Showtime:</strong> {selectedShowtime.start_time} -{" "}
            {selectedShowtime.end_time}
          </p>
          <p>
            <strong>Seats:</strong> {selectedSeats.join(", ")}
          </p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Ticket ${ticketCode} - ${movieTitle}`}
            alt="QR Ticket"
            style={{ margin: "10px auto", display: "block" }}
          />
          <p>Scan the QR code at the cinema to get your paper ticket 🎫</p>

          <button className="payment-button" onClick={onFinish}>
            🏠 Finish / Go to Home
          </button>
        </div>
      )}
    </div>
  );
}
