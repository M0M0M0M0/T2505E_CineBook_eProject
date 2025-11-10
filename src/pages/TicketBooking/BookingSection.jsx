import React, { useState, useEffect, useRef, useMemo } from "react";
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
  bookingId,
  setBookingId,
}) {
  const [allReservedSeats, setAllReservedSeats] = useState([]); // ✅ Đổi tên để phân biệt
  const [basePrice, setBasePrice] = useState(0);
  const [seatPricesMap, setSeatPricesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  const hasCheckedPending = useRef(false);

  // ✅ Tính toán soldSeats từ allReservedSeats, loại bỏ ghế đang chọn
  const soldSeats = useMemo(() => {
    if (bookingId && selectedSeats.length > 0) {
      return allReservedSeats.filter((seat) => !selectedSeats.includes(seat));
    }
    return allReservedSeats;
  }, [allReservedSeats, bookingId, selectedSeats]);

  // ✅ THÊM: Lưu bookingId vào sessionStorage mỗi khi thay đổi
  useEffect(() => {
    if (bookingId && showtimeId) {
      sessionStorage.setItem(`booking_${showtimeId}`, bookingId);
    }
  }, [bookingId, showtimeId]);

  // ✅ THÊM: Đánh dấu đã xử lý pending nếu có bookingId từ props
  useEffect(() => {
    if (bookingId) {
      hasCheckedPending.current = true;
    }
  }, [bookingId]);

  // ✅ THÊM: Khôi phục bookingId từ sessionStorage NHƯNG validate nó còn hợp lệ không
  useEffect(() => {
    const validateAndRestoreBooking = async () => {
      if (!bookingId && showtimeId) {
        const savedBookingId = sessionStorage.getItem(`booking_${showtimeId}`);
        if (savedBookingId) {
          // Kiểm tra booking có còn valid không
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `http://127.0.0.1:8000/api/bookings/${savedBookingId}/validate`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.is_valid) {
                console.log("🔄 Khôi phục bookingId hợp lệ:", savedBookingId);
                setBookingId(savedBookingId);
                return;
              }
            }
          } catch (error) {
            console.log("⚠️ Không thể validate booking:", error);
          }

          // Nếu không valid, xóa đi
          console.log("🗑️ Xóa bookingId không hợp lệ");
          sessionStorage.removeItem(`booking_${showtimeId}`);
        }
      }
    };

    validateAndRestoreBooking();
  }, [showtimeId]);

  // ✅ CHỈ check pending booking khi CHƯA có bookingId từ props
  useEffect(() => {
    if (
      showtimeId &&
      currentUserId &&
      !hasCheckedPending.current &&
      !bookingId
    ) {
      checkPendingBooking();
      hasCheckedPending.current = true;
    }
  }, [showtimeId, currentUserId, bookingId]);

  const checkPendingBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://127.0.0.1:8000/api/bookings/check-pending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            showtime_id: showtimeId,
          }),
        }
      );

      const result = await response.json();

      if (result.success && result.has_pending) {
        setPendingBooking(result.booking);
        setShowPendingDialog(true);
      }
    } catch (error) {
      console.error("Error checking pending booking:", error);
    }
  };

  const handleContinuePending = () => {
    setSelectedSeats(pendingBooking.seats);
    setBookingId(pendingBooking.booking_id);
    setShowPendingDialog(false);
    onSelectSeats({
      seats: pendingBooking.seats,
      total: calculateTotalForSeats(pendingBooking.seats),
      booking_id: pendingBooking.booking_id,
    });
  };

  const handleCancelPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/bookings/cancel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: pendingBooking.booking_id,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setPendingBooking(null);
        setShowPendingDialog(false);
        setSelectedSeats([]);

        if (setBookingId) {
          setBookingId(null);
          // ✅ Xóa bookingId khỏi sessionStorage
          if (showtimeId) {
            sessionStorage.removeItem(`booking_${showtimeId}`);
          }
        }

        await fetchReservedSeats();
      } else {
        alert(result.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling booking");
    }
  };

  const calculateTotalForSeats = (seats) => {
    const seatTypeMap = {};
    Object.entries(SEAT_LAYOUT).forEach(([row, seatsInRow]) => {
      seatsInRow.forEach((type, index) => {
        seatTypeMap[`${row}${index + 1}`] = type;
      });
    });

    let sum = 0;
    seats.forEach((seatCode) => {
      const localType = seatTypeMap[seatCode];
      const apiSeatName = mapLocalTypeToApiName(localType);
      const finalPrice = seatPricesMap[apiSeatName] || 0;
      sum += finalPrice;
    });

    return sum;
  };

  const fetchReservedSeats = async () => {
    if (!showtimeId) {
      setLoading(false);
      return;
    }

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

      // ✅ Lưu TẤT CẢ ghế reserved từ server
      const soldCodes = data.reserved_seats.map((s) => s.code);
      setAllReservedSeats(soldCodes);

      setBasePrice(parseFloat(data.base_showtime_price) || 0);

      const processedPrices = {};
      if (data.seat_type_prices) {
        Object.keys(data.seat_type_prices).forEach((key) => {
          const priceData = data.seat_type_prices[key];
          processedPrices[key] = parseFloat(priceData.seat_type_price) || 0;
        });
      }
      setSeatPricesMap(processedPrices);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Cannot load seating status.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHỈ phụ thuộc vào showtimeId
  useEffect(() => {
    fetchReservedSeats();
    const intervalId = setInterval(fetchReservedSeats, 30000);
    return () => clearInterval(intervalId);
  }, [showtimeId]);

  const calculateTotal = () => {
    if (Object.keys(seatPricesMap).length === 0) {
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
      const localType = seatTypeMap[seatCode];
      const apiSeatName = mapLocalTypeToApiName(localType);
      const finalPrice = seatPricesMap[apiSeatName] || 0;
      sum += finalPrice;
    });

    return sum;
  };

  const total = calculateTotal();

  const getSeatTypePrice = (localType) => {
    const apiSeatName = mapLocalTypeToApiName(localType);
    return seatPricesMap[apiSeatName] || 0;
  };

  const legendItems = [
    { type: "standard", label: "Standard", color: "#ddd" },
    { type: "gold", label: "Gold", color: "#FFD700" },
    { type: "platinum", label: "Platinum", color: "#E5E4E2" },
    { type: "box", label: "Box (Couple)", color: "#FF69B4" },
  ];

  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;
    if (soldSeats.includes(seatId)) return;

    const seatType = SEAT_LAYOUT[row][index];

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
      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((s) => s !== seatId)
          : [...prev, seatId]
      );
    }
  };

  const handleContinue = async () => {
    if (!selectedSeats.length) {
      alert("Please select seats before continue!");
      return;
    }

    if (!currentUserId) {
      alert("User ID is missing. Please login again.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login again.");
      window.location.href = "/login";
      return;
    }

    // ✅ KIỂM TRA: Khôi phục bookingId từ sessionStorage nếu bị mất
    let currentBookingId = bookingId;
    if (!currentBookingId && showtimeId) {
      currentBookingId = sessionStorage.getItem(`booking_${showtimeId}`);
      if (currentBookingId) {
        console.log(
          "🔄 Khôi phục bookingId trước khi update:",
          currentBookingId
        );
        setBookingId(currentBookingId);
      }
    }

    if (currentBookingId) {
      try {
        console.log("📤 Updating seats với bookingId:", currentBookingId);

        const updateEndpoint =
          "http://127.0.0.1:8000/api/bookings/update-seats";
        const updatePayload = {
          booking_id: currentBookingId,
          seat_codes: selectedSeats,
        };

        const apiResponse = await fetch(updateEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(`Server error: ${apiResponse.status} - ${errorText}`);
        }

        const apiResult = await apiResponse.json();

        if (apiResult.success) {
          onSelectSeats({
            seats: selectedSeats,
            total: total,
            showtimeId: showtimeId,
            basePrice: basePrice,
            seatPricesMap: seatPricesMap,
            booking_id: currentBookingId,
          });
          await fetchReservedSeats();
        } else {
          alert(apiResult.message || "Failed to update seats.");
          await fetchReservedSeats();
        }
      } catch (error) {
        console.error("UPDATE Error:", error);
        alert(`Failed to update seats: ${error.message}`);
      }
    } else {
      try {
        console.log("📤 Creating new booking...");

        const holdEndpoint = "http://127.0.0.1:8000/api/bookings/hold";
        const holdPayload = {
          showtime_id: showtimeId,
          seat_codes: selectedSeats,
          user_id: currentUserId,
        };

        const apiResponse = await fetch(holdEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(holdPayload),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(`Server error: ${apiResponse.status} - ${errorText}`);
        }

        const apiResult = await apiResponse.json();

        if (apiResult.success) {
          const finalBookingId = apiResult.booking_id;

          // ✅ Lưu bookingId mới vào sessionStorage
          sessionStorage.setItem(`booking_${showtimeId}`, finalBookingId);

          onSelectSeats({
            seats: selectedSeats,
            total: total,
            showtimeId: showtimeId,
            basePrice: basePrice,
            seatPricesMap: seatPricesMap,
            booking_id: finalBookingId,
          });
          await fetchReservedSeats();
        } else {
          alert(apiResult.message || "Failed to hold seats.");
          await fetchReservedSeats();
        }
      } catch (error) {
        console.error("HOLD Error:", error);
        alert(`Failed to hold seats: ${error.message}`);
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
      {/* Dialog pending booking */}
      {showPendingDialog && pendingBooking && (
        <div className="pending-dialog-overlay">
          <div className="pending-dialog">
            <h3>Bạn có booking đang chờ!</h3>
            <p>
              Bạn đã chọn {pendingBooking.seats.length} ghế:{" "}
              <strong>{pendingBooking.seats.join(", ")}</strong>
            </p>
            <p>
              Thời gian còn lại:{" "}
              <strong>
                {Math.floor(pendingBooking.time_remaining / 60)} phút{" "}
                {pendingBooking.time_remaining % 60} giây
              </strong>
            </p>
            <div className="pending-dialog-buttons">
              <button className="btn-continue" onClick={handleContinuePending}>
                Tiếp tục booking này
              </button>
              <button className="btn-cancel" onClick={handleCancelPending}>
                Hủy và chọn lại
              </button>
            </div>
          </div>
        </div>
      )}
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
        <h4>Total: ${total.toLocaleString("vi-VN")} </h4>

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
