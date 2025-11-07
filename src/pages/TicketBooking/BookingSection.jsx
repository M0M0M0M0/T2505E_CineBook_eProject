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
// Rất quan trọng vì tên key trong seatPricesMap phải khớp với tên trong API
const mapLocalTypeToApiName = (localType) => {
  switch (localType) {
    // Tên Tĩnh: Tên API
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
  selectedSeats,
  setSelectedSeats,
  onSelectSeats,
  onBack,
  showtimeId,
}) {
  console.log("DEBUG: Showtime ID received in BookingSection:", showtimeId);
  const [soldSeats, setSoldSeats] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  // seatPricesMap sẽ lưu { 'Box (Couple)': 20, 'Gold': 15, ... } (Giá trị đã là số)
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

      // 1. Ép kiểu Float cho Base Price
      setBasePrice(parseFloat(data.base_showtime_price) || 0);

      // 2. Xử lý Phụ phí: Ép kiểu giá từ String sang Number và tạo Map
      const processedPrices = {};
      if (data.seat_type_prices) {
        Object.keys(data.seat_type_prices).forEach((key) => {
          const priceData = data.seat_type_prices[key];
          // Key: "Box (Couple)", Value: Phụ phí (Đã là số)
          processedPrices[key] = parseFloat(priceData.seat_type_price) || 0;
        });
      }
      setSeatPricesMap(processedPrices);

      console.log("DEBUG: API Response Data:", data);
      console.log(
        "DEBUG: Final Base Price (Number):",
        parseFloat(data.base_showtime_price) || 0
      );
      console.log("DEBUG: Processed Seat Prices Map:", processedPrices);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Cannot load seating status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedSeats();
  }, [showtimeId]);

  // ====================================================================
  // 2. LOGIC TÍNH TỔNG TIỀN (Sử dụng Ánh xạ tên ghế và Giá đã ép kiểu)
  // ====================================================================
  const calculateTotal = () => {
    // Cần phải có Base Price và dữ liệu phụ phí để tính
    if (basePrice === 0 && Object.keys(seatPricesMap).length === 0) {
      return 0;
    }

    let sum = 0;

    const seatTypeMap = {};
    Object.entries(SEAT_LAYOUT).forEach(([row, seats]) => {
      seats.forEach((type, index) => {
        seatTypeMap[`${row}${index + 1}`] = type;
      });
    });

    selectedSeats.forEach((seatCode) => {
      const localType = seatTypeMap[seatCode]; // Ví dụ: 'box'

      // Ánh xạ 'box' -> 'Box (Couple)' để khớp với key trong seatPricesMap
      const apiSeatName = mapLocalTypeToApiName(localType);

      // Lấy phụ phí (đã là số) từ map
      const extraPrice = seatPricesMap[apiSeatName] || 0;

      // Giá vé = Giá Cơ sở + Phụ phí loại ghế (Tất cả đã là số)
      const finalPrice = basePrice + extraPrice;
      sum += finalPrice;
    });

    return sum;
  };

  const total = calculateTotal();

  // ====================================================================
  // 3. LOGIC TOGGLE SEAT VÀ HANDLE CONTINUE
  // ====================================================================
  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;
    if (soldSeats.includes(seatId)) return;

    const seatType = SEAT_LAYOUT[row][index];

    // Logic ghế đôi (Box)
    if (seatType === "box") {
      // ... (logic box giữ nguyên) ...
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

  const handleContinue = () => {
    if (!selectedSeats.length) {
      alert("Please select seats before continue!");
      return;
    }

    // TRUYỀN TẤT CẢ DỮ LIỆU CẦN THIẾT lên component cha
    onSelectSeats({
      seats: selectedSeats,
      total: total,
      showtimeId: showtimeId,
      basePrice: basePrice,
      seatPricesMap: seatPricesMap, // Truyền map giá đã xử lý
    });
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
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">{/* ... (Legend) ... */}</div>

      <div className="booking-summary">
        <h4>Booking Summary</h4>
        <p>Selected seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Base Price : {basePrice.toLocaleString("vi-VN")} VND</p>
        <h4>Total: {total.toLocaleString("vi-VN")} VND</h4>

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
