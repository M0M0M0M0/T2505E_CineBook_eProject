import React, { useState, useEffect } from "react";
import "./BookingSection.css";

// Sơ đồ ghế tĩnh (GIỮ NGUYÊN)
const SEAT_LAYOUT = {
  A: Array(16).fill("standard"),
  B: Array(16).fill("gold"),
  C: Array(16).fill("gold"),
  D: Array(16).fill("gold"),
  E: Array(16).fill("gold"),
  F: Array(16).fill("gold"),
  G: Array(16).fill("box"),
};
SEAT_LAYOUT.B[0] = "standard";
SEAT_LAYOUT.B[1] = "standard";
SEAT_LAYOUT.B[14] = "standard";
SEAT_LAYOUT.B[15] = "standard";
["C", "D", "E"].forEach((row) => {
  for (let i = 2; i <= 13; i++) {
    SEAT_LAYOUT[row][i] = "platinum";
  }
});

// Hàm ánh xạ: Chuyển tên loại ghế tĩnh ('box') sang tên loại ghế trong API ('Box (Couple)')
const mapLocalTypeToApiName = (localType) => {
  switch (localType) {
    case "box":
      return "Box (Couple)";
    case "standard":
      return "Standard";
    case "gold":
      return "Gold";
    case "platinum":
      return "Platinum";
    default:
      return localType;
  }
};

export default function BookingSection({
  movieTitle,
  selectedShowtime,
  selectedSeats,
  setSelectedSeats,
  onSelectSeats,
  onBack,
  showtimeId,
  currentUserId,
}) {
  // console.log("DEBUG: Showtime ID received in BookingSection:", showtimeId);
  const [soldSeats, setSoldSeats] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  const [seatPricesMap, setSeatPricesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================================================================
  // 1. FETCH DỮ LIỆU GHẾ ĐÃ BÁN, GIÁ CƠ SỞ VÀ PHỤ PHÍ (API GET)
  // ====================================================================

  const fetchReservedSeats = async () => {
    if (!showtimeId) {
      setLoading(false);
      return;
    }
    console.log("Fetching reserved seats for showtimeId:", showtimeId);

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/showtimes/${showtimeId}/sold-seats`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reserved seats.");
      }
      const result = await response.json();
      const data = result.data;

      const soldCodes = data.reserved_seats.map((s) => s.code);
      setSoldSeats(soldCodes);

      // ✅ Giá base giờ không cần thiết vì API đã trả về giá cuối cùng
      setBasePrice(parseFloat(data.base_showtime_price) || 0);

      // ✅ Xử lý giá ghế: API đã tính sẵn giá cuối cùng
      const processedPrices = {};
      if (data.seat_type_prices) {
        Object.keys(data.seat_type_prices).forEach((key) => {
          const priceData = data.seat_type_prices[key];
          // Lưu giá CUỐI CÙNG đã áp dụng modifiers
          processedPrices[key] = parseFloat(priceData.seat_type_price) || 0;
        });
      }
      setSeatPricesMap(processedPrices);

      console.log("✅ Processed Seat Prices:", processedPrices);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Cannot load seating status.");
    } finally {
      setLoading(false);
    }
  };

  // ⬅️ THÊM LOGIC CẬP NHẬT TRẠNG THÁI GHẾ MỖI 30 GIÂY
  useEffect(() => {
    fetchReservedSeats(); // Chạy lần đầu

    // Thiết lập interval chạy lại sau mỗi 30 giây
    const intervalId = setInterval(fetchReservedSeats, 30000);

    // Hàm dọn dẹp (cleanup) khi component bị unmount
    return () => clearInterval(intervalId);
  }, [showtimeId]);

  // ====================================================================
  // 2. LOGIC TÍNH TỔNG TIỀN (GIỮ NGUYÊN)
  // ====================================================================
  const calculateTotal = () => {
    if (Object.keys(seatPricesMap).length === 0) {
      return 0;
    }

    let sum = 0;

    // Tạo map từ seat code sang loại ghế
    const seatTypeMap = {};
    Object.entries(SEAT_LAYOUT).forEach(([row, seats]) => {
      seats.forEach((type, index) => {
        seatTypeMap[`${row}${index + 1}`] = type;
      });
    });

    selectedSeats.forEach((seatCode) => {
      const localType = seatTypeMap[seatCode];
      const apiSeatName = mapLocalTypeToApiName(localType);

      // ✅ Giá đã được tính sẵn từ API (bao gồm base + seat type + modifiers)
      const finalPrice = seatPricesMap[apiSeatName] || 0;
      sum += finalPrice;
    });

    return sum;
  };

  const total = calculateTotal();

  // ====================================================================
  // 3. TẠO LEGEND VỚI GIÁ TIỀN (GIỮ NGUYÊN)
  // ====================================================================
  const getSeatTypePrice = (localType) => {
    const apiSeatName = mapLocalTypeToApiName(localType);
    // ✅ Trả về giá cuối cùng đã tính sẵn từ API
    return seatPricesMap[apiSeatName] || 0;
  };

  // Danh sách các loại ghế để hiển thị trong legend
  const legendItems = [
    { type: "standard", label: "Standard", color: "#ddd" },
    { type: "gold", label: "Gold", color: "#FFD700" },
    { type: "platinum", label: "Platinum", color: "#E5E4E2" },
    { type: "box", label: "Box (Couple)", color: "#FF69B4" },
  ];

  // ====================================================================
  // 4. LOGIC TOGGLE SEAT VÀ HANDLE CONTINUE
  // ====================================================================
  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;
    if (soldSeats.includes(seatId)) return;

    const seatType = SEAT_LAYOUT[row][index];

    // Logic ghế đôi (Box)
    if (seatType === "box") {
      const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
      const pairSeatId = `${row}${pairIndex + 1}`;

      const seatsToToggle = [seatId];
      if (
        pairIndex >= 0 &&
        pairIndex < SEAT_LAYOUT[row].length &&
        SEAT_LAYOUT[row][pairIndex] === "box"
      ) {
        seatsToToggle.push(pairSeatId);
      }

      if (seatsToToggle.some((s) => soldSeats.includes(s))) return;

      const allSelected = seatsToToggle.every((s) => selectedSeats.includes(s));

      if (allSelected) {
        setSelectedSeats((prev) =>
          prev.filter((s) => !seatsToToggle.includes(s))
        );
      } else {
        setSelectedSeats((prev) => [...new Set([...prev, ...seatsToToggle])]);
      }
    } else {
      // Logic ghế đơn
      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((s) => s !== seatId)
          : [...prev, seatId]
      );
    }
  };

  // ⬅️ CẬP NHẬT HÀM HANDLE CONTINUE ĐỂ GỌI API TẠO BOOKING
  const handleContinue = async () => {
    if (!selectedSeats.length) {
      alert("Please select seats before continue!");
      return;
    }

    // Kiểm tra user_id
    if (!currentUserId) {
      alert("User ID is missing. Please login again.");
      return;
    }

    // console.log("🔍 DEBUG - Sending data:", {
    //   showtime_id: showtimeId,
    //   seat_codes: selectedSeats,
    //   user_id: currentUserId,
    // });

    // 1. GỌI API holdSeats (POST /api/bookings/hold)
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // console.log("🔍 DEBUG - Token from localStorage:", token);

      if (!token) {
        alert("Token not found. Please login again.");
        window.location.href = "/login";
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ LUÔN GỬI TOKEN
        Accept: "application/json", // ⬅️ THÊM ĐỂ BẢO ĐẢM RESPONSE LÀ JSON
      };

      // console.log("🔍 DEBUG - Request headers:", headers);

      const response = await fetch("http://127.0.0.1:8000/api/bookings/hold", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          showtime_id: showtimeId,
          seat_codes: selectedSeats,
          user_id: currentUserId, // ⬅️ Gửi kèm user_id nếu backend không dùng middleware
        }),
      });

      // console.log("🔍 DEBUG - Response status:", response.status);

      // Kiểm tra response trước khi parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 DEBUG - Error response:", errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      // console.log("🔍 DEBUG - API Result:", result);

      if (response.ok && result.success) {
        // 2. Chuyển sang bước tiếp theo VÀ TRẢ VỀ booking_id
        onSelectSeats({
          seats: selectedSeats,
          total: total,
          showtimeId: showtimeId,
          basePrice: basePrice,
          seatPricesMap: seatPricesMap,
          booking_id: result.booking_id,
        });
        // Ngay sau khi hold thành công, cập nhật lại trạng thái ghế trên FE
        fetchReservedSeats();
      } else {
        // Nếu hold thất bại (ví dụ: ghế vừa bị người khác giữ trước đó)
        alert(
          result.message ||
            "Failed to hold seats. Please check the seat status."
        );
        // Cập nhật lại ngay lập tức để hiển thị ghế đã bị giữ
        fetchReservedSeats();
      }
    } catch (error) {
      console.error("Error holding seats:", error);

      // Hiển thị thông báo lỗi chi tiết hơn
      if (error instanceof SyntaxError) {
        alert("Server returned invalid response. Please try again.");
      } else {
        alert("An unexpected error occurred during seat reservation.");
      }
    }
  };

  if (loading) {
    return (
      <div className="booking-section loading">
        Đang tải trạng thái ghế và giá...
      </div>
    );
  }

  if (error) {
    return <div className="booking-section error">Error: {error}</div>;
  }

  return (
    <div className="booking-section">
      <div className="screen">SCREEN</div>

      <div className="seat-map">
        {Object.entries(SEAT_LAYOUT).map(([row, seatsInRow]) => (
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
                    style={{ cursor: isSold ? "not-allowed" : "pointer" }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND - Hiển thị màu sắc, tên và giá của từng loại ghế */}
      <div className="legend">
        {legendItems.map((item) => {
          const price = getSeatTypePrice(item.type);
          return (
            <div key={item.type}>
              <span className={`legend-box ${item.type}`}></span>
              <span className="legend-text">
                {item.label}:{" "}
                <span className="legend-price">
                  ${price.toLocaleString("vi-VN")} 
                </span>
              </span>
            </div>
          );
        })}
        <div>
          <span className="legend-box selected"></span>
          <span className="legend-text">Selected</span>
        </div>
        <div>
          <span className="legend-box sold"></span>
          <span className="legend-text">Sold/Reserved</span>
        </div>
      </div>

      <div className="booking-summary">
        <h4>Booking Summary</h4>
        <p>Selected seats: {selectedSeats.join(", ") || "None"}</p>
        <h4>Total: ${total.toLocaleString("vi-VN")}  </h4>

        <div className="total-buttons">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back
            </button>
          )}
          <button className="total-button" onClick={handleContinue}>
            Next (Food & Drinks)
          </button>
        </div>
      </div>
    </div>
  );
}
