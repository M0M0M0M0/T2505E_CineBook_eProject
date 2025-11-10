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
  const [allReservedSeats, setAllReservedSeats] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  const [seatPricesMap, setSeatPricesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  const hasCheckedPending = useRef(false);
  const updateTimeoutRef = useRef(null);
  const [currentBookingSeats, setCurrentBookingSeats] = useState([]); // seats that belong to current bookingId

  const soldSeats = useMemo(() => {
    const bookingSeats = pendingBooking?.seats || [];

    return allReservedSeats.filter(
      (seat) => !bookingSeats.includes(seat) && !selectedSeats.includes(seat)
    );
  }, [allReservedSeats, pendingBooking, selectedSeats]);
  // ✅ Debug soldSeats và các biến liên quan
  // useEffect(() => {
  //   console.log("DEBUG allReservedSeats:", allReservedSeats);
  //   console.log("DEBUG currentBookingSeats:", currentBookingSeats);
  //   console.log("DEBUG selectedSeats:", selectedSeats);
  //   console.log("DEBUG computed soldSeats:", soldSeats);
  // }, [allReservedSeats, currentBookingSeats, selectedSeats, soldSeats]);

  useEffect(() => {
    const fetchBookingSeats = async () => {
      if (!bookingId) {
        setCurrentBookingSeats([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://127.0.0.1:8000/api/bookings/${bookingId}/validate`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        if (!res.ok) {
          console.warn(
            "Cannot fetch booking details for bookingId:",
            bookingId
          );
          setCurrentBookingSeats([]);
          return;
        }

        const data = await res.json();

        // Tùy API shape: nếu API trả { data: { seats: [...] } } hoặc { seats: [...] }
        const seatsFromBooking =
          (data && data.data && data.data.seats) ||
          data.seats ||
          data.seat_codes ||
          [];

        setCurrentBookingSeats(
          Array.isArray(seatsFromBooking) ? seatsFromBooking : []
        );
      } catch (err) {
        console.error("Error fetching booking seats:", err);
        setCurrentBookingSeats([]);
      }
    };

    fetchBookingSeats();
  }, [bookingId]);

  // ✅ Đánh dấu đã xử lý pending nếu có bookingId từ props
  useEffect(() => {
    if (bookingId) {
      hasCheckedPending.current = true;
    }
  }, [bookingId]);

  // ✅ Khôi phục bookingId từ sessionStorage (nếu có)
  useEffect(() => {
    if (!bookingId && showtimeId) {
      const savedBookingId = sessionStorage.getItem(`booking_${showtimeId}`);
      if (savedBookingId) {
        console.log("🔄 Khôi phục bookingId:", savedBookingId);
        setBookingId(savedBookingId);
      }
    }
  }, [showtimeId, bookingId, setBookingId]);

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
      } else {
        // ✅ THÊM LOGIC NÀY VÀO ĐÂY: DỌN DẸP BOOKING CŨ
        if (bookingId) {
          console.warn(
            `Booking ID ${bookingId} recovered from storage is not pending. Clearing.`
          );

          // 1. Xóa khỏi state React
          if (setBookingId) {
            setBookingId(null);
          }
          // 2. Xóa khỏi Session Storage
          if (showtimeId) {
            sessionStorage.removeItem(`booking_${showtimeId}`);
          }
        }
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

  const toggleSeat = async (row, index) => {
    const seatId = `${row}${index + 1}`;
    if (soldSeats.includes(seatId)) return;

    const seatType = SEAT_LAYOUT[row][index];
    let newSelectedSeats;

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
        newSelectedSeats = selectedSeats.filter(
          (s) => !seatsToToggle.includes(s)
        );
      } else {
        newSelectedSeats = [...new Set([...selectedSeats, ...seatsToToggle])];
      }
    } else {
      if (selectedSeats.includes(seatId)) {
        newSelectedSeats = selectedSeats.filter((s) => s !== seatId);
      } else {
        newSelectedSeats = [...selectedSeats, seatId];
      }
    }

    // ✅ Cập nhật state trước
    setSelectedSeats(newSelectedSeats);
  };

  // ✅ Hàm update seats lên server
  const updateSeatsOnServer = async (seats) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://127.0.0.1:8000/api/bookings/update-seats",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            seat_codes: seats,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes("completed")) {
          console.log("⚠️ Booking đã completed");
          sessionStorage.removeItem(`booking_${showtimeId}`);
          setBookingId(null);
        }
        throw new Error(errorData.message || "Failed to update seats");
      }

      // ✅ Refresh danh sách ghế đã bán
      await fetchReservedSeats();
    } catch (error) {
      console.error("Error updating seats:", error);
    }
  };

  const handleContinue = async () => {
    // 1. DEBUG CÁC GIÁ TRỊ BAN ĐẦU
    console.log("--- BẮT ĐẦU handleContinue ---");
    console.log("selectedSeats:", selectedSeats);
    console.log("currentUserId:", currentUserId);
    console.log("showtimeId:", showtimeId);

    if (!selectedSeats.length) {
      alert("Please select seats before continue!");
      return;
    }

    if (!currentUserId) {
      alert("User ID is missing. Please login again.");
      return;
    }

    const token = localStorage.getItem("token");
    console.log(
      "Token status:",
      token ? "Token loaded" : "Token is null/missing"
    );

    if (!token) {
      alert("Token not found. Please login again.");
      window.location.href = "/login";
      return;
    }

    // Khôi phục bookingId từ sessionStorage (hoặc giá trị prop)
    let currentBookingId = bookingId || null;
    let isNewBooking = false;

    // 1. Logic HOẶC TẠO MỚI (POST /hold) HOẶC SỬ DỤNG BOOKING CŨ
    if (!currentBookingId) {
      try {
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
        const apiResult = await apiResponse.json();

        if (apiResult.success) {
          currentBookingId = apiResult.booking_id;
          setBookingId(currentBookingId);
          sessionStorage.setItem(`booking_${showtimeId}`, currentBookingId);
          isNewBooking = true;
          await fetchReservedSeats();
        } else {
          alert(apiResult.message || "Failed to hold seats.");
          return; // THOÁT NẾU HOLD THẤT BẠI
        }
      } catch (err) {
        console.error("Failed to create booking:", err);
        alert("Failed to create booking.");
        return; // THOÁT NẾU LỖI MẠNG
      }
    }

    // 2. Logic CẬP NHẬT GHẾ (PUT /update-seats)
    // Chỉ cập nhật nếu:
    // a) Đã có bookingId hợp lệ
    // b) Đây KHÔNG PHẢI là booking vừa được tạo (vì API hold đã giữ chỗ rồi)
    if (currentBookingId && !isNewBooking) {
      try {
        const updateEndpoint =
          "http://127.0.0.1:8000/api/bookings/update-seats";

        // Dòng này phải chứa URL đầy đủ
        console.log("UPDATE SEATS URL:", updateEndpoint);

        const updatePayload = {
          booking_id: currentBookingId, // DỮ LIỆU BẮT BUỘC ĐƯỢC GỬI
          seat_codes: selectedSeats,
        };

        const updateResponse = await fetch(updateEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        });

        if (!updateResponse.ok) throw new Error("Failed to update seats");
        await fetchReservedSeats();
      } catch (err) {
        console.error("Failed to update seats:", err);
      }
    }

    // 3. Chuyển sang bước tiếp theo
    if (currentBookingId) {
      onSelectSeats({
        seats: selectedSeats,
        total: calculateTotal(),
        booking_id: currentBookingId,
      });
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
      {showPendingDialog && pendingBooking && (
        <div className="pending-dialog-overlay">
          <div className="pending-dialog">
            <h3>You have an unfinished booking</h3>
            <p>
              You have chosen {pendingBooking.seats.length} seats:{" "}
              <strong>{pendingBooking.seats.join(", ")}</strong>
            </p>
            <p>
              Remaining time:{" "}
              <strong>
                {Math.floor(pendingBooking.time_remaining / 60)} minutes{" "}
                {pendingBooking.time_remaining % 60} seconds
              </strong>
            </p>
            <div className="pending-dialog-buttons">
              <button className="btn-continue" onClick={handleContinuePending}>
                Continue Booking
              </button>
              <button className="btn-cancel" onClick={handleCancelPending}>
                Cancel Booking
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
