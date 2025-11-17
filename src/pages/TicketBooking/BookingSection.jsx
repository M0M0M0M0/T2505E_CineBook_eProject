import React, { useState, useEffect, useRef, useCallback } from "react";
import "./BookingSection.css";

// ==================== CONSTANTS ====================
const SEAT_LAYOUT = {
  A: Array(16).fill("standard"),
  B: Array(16).fill("gold"),
  C: Array(16).fill("gold"),
  D: Array(16).fill("gold"),
  E: Array(16).fill("gold"),
  F: Array(16).fill("gold"),
  G: Array(16).fill("box"),
};

// Customize specific seats
SEAT_LAYOUT.B[0] = "standard";
SEAT_LAYOUT.B[1] = "standard";
SEAT_LAYOUT.B[14] = "standard";
SEAT_LAYOUT.B[15] = "standard";
["C", "D", "E"].forEach((row) => {
  for (let i = 2; i <= 13; i++) {
    SEAT_LAYOUT[row][i] = "platinum";
  }
});

const SEAT_TYPE_MAP_TO_API = {
  box: "Box (Couple)",
  standard: "Standard",
  gold: "Gold",
  platinum: "Platinum",
};

const API_BASE = "http://127.0.0.1:8000/api";
const REFRESH_INTERVAL = 30000; // 30 seconds

// ==================== MAIN COMPONENT ====================
export default function BookingSection({
  movieTitle,
  selectedShowtime,
  selectedSeats,
  setSelectedSeats,
  onSelectSeats,
  onBack,
  showtimeId,
  bookingId,
  setBookingId,
}) {
  const [pendingCountdown, setPendingCountdown] = useState(0);
  // -------------------- STATE --------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Seat data from server
  const [allReservedSeats, setAllReservedSeats] = useState([]); 
  const [myBookingSeats, setMyBookingSeats] = useState([]); 

  // Pricing
  const [seatPrices, setSeatPrices] = useState({});

  // Pending booking dialog
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  // Refs for flags
  const hasCheckedPendingRef = useRef(false);

  // -------------------- COMPUTED VALUES --------------------
  // Seats that are actually sold (excluding my booking)
  const soldSeats = allReservedSeats.filter(
    (seat) => !myBookingSeats.includes(seat)
  );

  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    // console.log("📝 User ID from localStorage:", userId);
    setCurrentUserId(userId);
  }, []);

  // ==================== API CALLS ====================

  // Fetch all reserved seats for this showtime
  const fetchReservedSeats = useCallback(async () => {
    if (!showtimeId) return;

    try {
      const response = await fetch(
        `${API_BASE}/showtimes/${showtimeId}/sold-seats`
      );

      if (!response.ok) throw new Error("Failed to fetch seats");

      const result = await response.json();
      const data = result.data;

      // Extract reserved seat codes
      const reservedCodes = data.reserved_seats?.map((s) => s.code) || [];
      setAllReservedSeats(reservedCodes);

      // Extract pricing
      const prices = {};
      if (data.seat_type_prices) {
        Object.entries(data.seat_type_prices).forEach(([key, value]) => {
          prices[key] = parseFloat(value.seat_type_price) || 0;
        });
      }
      setSeatPrices(prices);
    } catch (err) {
      console.error("Error fetching reserved seats:", err);
      setError("Cannot load seat information");
    }
  }, [showtimeId]);

  // Fetch current booking details
  const fetchBookingDetails = useCallback(async (bookingIdToFetch) => {
    if (!bookingIdToFetch) {
      setMyBookingSeats([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/bookings/${bookingIdToFetch}/validate`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        console.warn("Cannot fetch booking details");
        setMyBookingSeats([]);
        return;
      }

      const result = await response.json();
      const seats =
        result.data?.seats || result.seats || result.seat_codes || [];

      setMyBookingSeats(Array.isArray(seats) ? seats : []);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setMyBookingSeats([]);
    }
  }, []);

  // Create new booking (hold seats)
  const createBooking = async (seats) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/bookings/hold`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        showtime_id: showtimeId,
        seat_codes: seats,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to hold seats");
    }

    return result.booking_id;
  };

  // Update existing booking seats
  const updateBookingSeats = async (bookingIdToUpdate, seats) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/bookings/update-seats`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_id: bookingIdToUpdate,
        seat_codes: seats,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update seats");
    }

    return await response.json();
  };

  // Cancel booking
  const cancelBooking = async (bookingIdToCancel) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/bookings/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_id: bookingIdToCancel,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to cancel booking");
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (pendingBooking && pendingBooking.time_remaining) {
      // console.log(
      //   "⏰ Setting initial countdown:",
      //   pendingBooking.time_remaining
      // );
      setPendingCountdown(pendingBooking.time_remaining);
    }
  }, [pendingBooking]);
  useEffect(() => {
    if (!showPendingDialog || pendingCountdown <= 0) {
      return;
    }

    // console.log("✅ Starting countdown from:", pendingCountdown);

    const interval = setInterval(() => {
      setPendingCountdown((prev) => {
        if (prev <= 1) {
          console.log("⏰ Time expired!");
          clearInterval(interval);
          setShowPendingDialog(false);
          setPendingBooking(null);
          setBookingId(null);
          setMyBookingSeats([]);
          localStorage.removeItem(`booking_${showtimeId}`);
          alert("Booking has expired!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      // console.log("🧹 Cleaning up countdown");
      clearInterval(interval);
    };
  }, [showPendingDialog, pendingCountdown]);

  useEffect(() => {
    hasCheckedPendingRef.current = false;
    // console.log("🔄 Reset hasCheckedPendingRef for new showtime:", showtimeId);
  }, [showtimeId]);

  useEffect(() => {
    // console.log("🔍 useEffect check pending triggered", {
    //   showtimeId,
    //   currentUserId,
    //   hasCheckedPending: hasCheckedPendingRef.current,
    // });

    const checkPendingBooking = async () => {
      if (!showtimeId || !currentUserId) {
        // console.log("❌ Missing showtimeId or currentUserId");
        return;
      }

      // console.log("🚀 Starting pending booking check...");

      const savedBookingId = localStorage.getItem(`booking_${showtimeId}`);

      // console.log("💾 Saved bookingId from localStorage:", savedBookingId);

      if (savedBookingId) {
        try {
          // console.log("🔄 Validating saved booking...");
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${API_BASE}/bookings/${savedBookingId}/validate`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );

          // console.log("📡 Validate response status:", response.status);

          if (response.ok) {
            const result = await response.json();
            // console.log("✅ Validate result:", result);

            if (result.status === "pending" || result.status === "hold") {
              const seats = result.seats || result.data?.seats || [];
              const expiresAt = new Date(result.expires_at);
              const now = new Date();
              const timeRemaining = Math.max(
                0,
                Math.floor((expiresAt - now) / 1000)
              );

              // console.log("🎫 Found valid booking:", {
              //   booking_id: savedBookingId,
              //   seats,
              //   timeRemaining,
              // });

              setPendingBooking({
                booking_id: savedBookingId,
                seats: Array.isArray(seats) ? seats : [],
                time_remaining: timeRemaining,
              });
              setShowPendingDialog(true);
              setBookingId(savedBookingId);
              setMyBookingSeats(seats);
              hasCheckedPendingRef.current = true;

              // console.log("✅ Dialog should show now");
              return; 
            } else {
              
              // console.log(
              //   "⚠️ Booking not pending anymore, status:",
              //   result.status
              // );
              localStorage.removeItem(`booking_${showtimeId}`);
            }
          } else {
            
            // console.log("❌ Booking validation failed");
            localStorage.removeItem(`booking_${showtimeId}`);
          }
        } catch (err) {
          // console.error("💥 Error validating saved booking:", err);
          localStorage.removeItem(`booking_${showtimeId}`);
        }
      }

      if (!hasCheckedPendingRef.current) {
        // console.log("🔍 Checking pending booking from server...");
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            // console.log("❌ No auth token");
            return;
          }

          const response = await fetch(`${API_BASE}/bookings/check-pending`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ showtime_id: showtimeId }),
          });

          // console.log("📡 check-pending response status:", response.status);
          const result = await response.json();
          // console.log("📦 check-pending result:", result);

          if (result.success && result.has_pending) {
            console.log(
              "🎉 Found pending booking from server:",
              result.booking
            );

            setPendingBooking(result.booking);
            setShowPendingDialog(true);

            localStorage.setItem(
              `booking_${showtimeId}`,
              result.booking.booking_id
            );
            setBookingId(result.booking.booking_id);
            setMyBookingSeats(result.booking.seats || []);

            console.log("✅ Dialog should show now from server data");
          } else {
            // console.log("ℹ️ No pending booking found on server");
          }
        } catch (err) {
          // console.error("💥 Error checking pending booking:", err);
        } finally {
          hasCheckedPendingRef.current = true;
          // console.log("🏁 Pending check completed");
        }
      } else {
        console.log("⏭️ Already checked pending, skipping");
      }
    };

    checkPendingBooking();
  }, [showtimeId, currentUserId, setBookingId]);

  // Detect if user is coming back from Food page and clear booking
  useEffect(() => {
    const handleClearBookingOnReturn = async () => {
      const wentToFood = localStorage.getItem(`went_to_food_${showtimeId}`);

      if (wentToFood === "true" && bookingId) {
        // console.log(
        //   "User returned from Food page, clearing booking:",
        //   bookingId
        // );

        try {
          await cancelBooking(bookingId);

          setBookingId(null);
          setMyBookingSeats([]);
          setSelectedSeats([]);
          localStorage.removeItem(`booking_${showtimeId}`);
          localStorage.removeItem(`went_to_food_${showtimeId}`);

          await fetchReservedSeats();

          // console.log("Booking cleared successfully, ready for new booking");
        } catch (err) {
          console.error("Error clearing booking on return:", err);
        }
      }
    };

    handleClearBookingOnReturn();
  }, []);

  useEffect(() => {
    if (!bookingId && !localStorage.getItem(`booking_${showtimeId}`)) {
      // console.log("🆕 Starting fresh booking, clearing selected seats");
      setSelectedSeats([]);
      setMyBookingSeats([]);
    }
  }, [showtimeId]);

  // Load booking details when bookingId changes
  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId, fetchBookingDetails]);

  // Fetch reserved seats on mount and periodically
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchReservedSeats();
      setLoading(false);
    };

    loadData();

    const intervalId = setInterval(fetchReservedSeats, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchReservedSeats]);

  // Sync selectedSeats with myBookingSeats when coming back from another page
  useEffect(() => {
    if (bookingId && myBookingSeats.length > 0 && selectedSeats.length === 0) {
      // console.log("Syncing selectedSeats with myBookingSeats:", myBookingSeats);
      setSelectedSeats(myBookingSeats);
    }
  }, [bookingId, myBookingSeats, selectedSeats.length, setSelectedSeats]);

  // Debug dialog state
  // useEffect(() => {
  //   console.log("🎭 Dialog state:", {
  //     showPendingDialog,
  //     pendingBooking,
  //   });
  // }, [showPendingDialog, pendingBooking]);

  // ==================== EVENT HANDLERS ====================

  // Handle seat selection/deselection
  const toggleSeat = (row, index) => {
    const seatId = `${row}${index + 1}`;

    // Cannot select sold seats
    if (soldSeats.includes(seatId)) return;

    const seatType = SEAT_LAYOUT[row][index];
    let newSelectedSeats;

    // Handle Box (Couple) seats - must select in pairs
    if (seatType === "box") {
      const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
      const pairSeatId = `${row}${pairIndex + 1}`;

      const seatsToToggle = [seatId];

      // Add pair seat if it exists and is also a box seat
      if (
        pairIndex >= 0 &&
        pairIndex < SEAT_LAYOUT[row].length &&
        SEAT_LAYOUT[row][pairIndex] === "box"
      ) {
        seatsToToggle.push(pairSeatId);
      }

      // Check if any seat in pair is sold
      if (seatsToToggle.some((s) => soldSeats.includes(s))) return;

      // Check if both seats are already selected
      const allSelected = seatsToToggle.every((s) => selectedSeats.includes(s));

      if (allSelected) {
        // Deselect both
        newSelectedSeats = selectedSeats.filter(
          (s) => !seatsToToggle.includes(s)
        );
      } else {
        // Select both
        newSelectedSeats = [...new Set([...selectedSeats, ...seatsToToggle])];
      }
    } else {
      // Handle regular seats
      if (selectedSeats.includes(seatId)) {
        // Deselect
        newSelectedSeats = selectedSeats.filter((s) => s !== seatId);
      } else {
        // Select
        newSelectedSeats = [...selectedSeats, seatId];
      }
    }

    setSelectedSeats(newSelectedSeats);
  };

  // Handle continue to next step
  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue");
      window.location.href = "/login";
      return;
    }

    try {
      let currentBookingId = bookingId;

      if (!currentBookingId) {
        
        // console.log("Creating new booking with seats:", selectedSeats);
        currentBookingId = await createBooking(selectedSeats);
        setBookingId(currentBookingId);
        localStorage.setItem(`booking_${showtimeId}`, currentBookingId);
        setMyBookingSeats(selectedSeats);
      } else {
        
        // console.log(
        //   "Updating booking",
        //   currentBookingId,
        //   "with seats:",
        //   selectedSeats
        // );
        await updateBookingSeats(currentBookingId, selectedSeats);
        setMyBookingSeats(selectedSeats);
      }

      // Set flag: User is going to Food page
      localStorage.setItem(`went_to_food_${showtimeId}`, "true");

      // Proceed to next step
      onSelectSeats({
        seats: selectedSeats,
        total: calculateTotal(selectedSeats),
        booking_id: currentBookingId,
      });
    } catch (err) {
      console.error("Error creating/updating booking:", err);

      await fetchReservedSeats();

      const errorMessage = err.message || "Failed to process booking";

      // Show error to user
      alert(errorMessage);

      setSelectedSeats([]);

      if (bookingId) {
        try {
          await cancelBooking(bookingId);
          setBookingId(null);
          setMyBookingSeats([]);
          localStorage.removeItem(`booking_${showtimeId}`);
        } catch (cancelErr) {
          console.error("Failed to cancel booking after error:", cancelErr);
        }
      }
    }
  };

  // Handle pending booking continuation
  const handleContinuePending = async () => {
    try {
      // Validate data
      if (
        !pendingBooking ||
        !pendingBooking.seats ||
        pendingBooking.seats.length === 0
      ) {
        alert("Invalid booking data");
        return;
      }

      const seats = pendingBooking.seats;
      const bookingIdToUse = pendingBooking.booking_id;
      const total = calculateTotal(seats);

      // console.log("✅ Continuing with pending booking:", {
      //   booking_id: bookingIdToUse,
      //   seats: seats,
      //   total: total,
      // });

      // Update state
      setSelectedSeats(seats);
      setBookingId(bookingIdToUse);
      setMyBookingSeats(seats);

      // Save to localStorage
      localStorage.setItem(`booking_${showtimeId}`, bookingIdToUse);
      localStorage.setItem(`went_to_food_${showtimeId}`, "true");

      // Close dialog
      setShowPendingDialog(false);
      setPendingBooking(null);

      onSelectSeats({
        seats: seats,
        total: total,
        booking_id: bookingIdToUse,
      });
    } catch (err) {
      console.error("❌ Error continuing pending booking:", err);
      alert("Failed to continue booking. Please try again.");
    }
  };

  // Handle pending booking cancellation
  const handleCancelPending = async () => {
    try {
      await cancelBooking(pendingBooking.booking_id);

      setPendingBooking(null);
      setShowPendingDialog(false);
      setSelectedSeats([]);
      setBookingId(null);
      setMyBookingSeats([]);
      localStorage.removeItem(`booking_${showtimeId}`);

      await fetchReservedSeats();
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  // ==================== HELPER FUNCTIONS ====================

  // Calculate total price for given seats
  const calculateTotal = (seats = selectedSeats) => {
    let total = 0;

    seats.forEach((seatCode) => {
      const row = seatCode[0];
      const col = parseInt(seatCode.substring(1)) - 1;
      const seatType = SEAT_LAYOUT[row]?.[col];

      if (seatType) {
        const apiName = SEAT_TYPE_MAP_TO_API[seatType];
        const price = seatPrices[apiName] || 0;
        total += price;
      }
    });

    return total;
  };

  // Get price for a seat type
  const getSeatTypePrice = (localType) => {
    const apiName = SEAT_TYPE_MAP_TO_API[localType];
    return seatPrices[apiName] || 0;
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="booking-section loading">Loading seat information...</div>
    );
  }

  if (error) {
    return <div className="booking-section error">Error: {error}</div>;
  }

  const legendItems = [
    { type: "standard", label: "Standard" },
    { type: "gold", label: "Gold" },
    { type: "platinum", label: "Platinum" },
    { type: "box", label: "Box (Couple)" },
  ];

  const total = calculateTotal();

  return (
    <div className="booking-section">
      {/* Pending Booking Dialog */}
      {showPendingDialog && pendingBooking && (
        <div className="pending-dialog-overlay">
          <div className="pending-dialog">
            <h3>You have an unfinished booking</h3>
            <p>
              You have selected {pendingBooking.seats.length} seats:{" "}
              <strong>{pendingBooking.seats.join(", ")}</strong>
            </p>
            <p>
              Time remaining:{" "}
              <strong className={pendingCountdown < 60 ? "text-danger" : ""}>
                {Math.floor(pendingCountdown / 60)}m {pendingCountdown % 60}s
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

      {/* Screen */}
      <div className="screen">SCREEN</div>

      {/* Seat Map */}
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

      {/* Legend */}
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

      {/* Booking Summary */}
      <div className="booking-summary">
        <h4>Booking Summary</h4>
        <p>
          Selected seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
        <h4>Total: ${total.toLocaleString("vi-VN")}</h4>

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
