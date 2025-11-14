import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./PendingBookingDialog.css";

export default function PendingBookingDialog() {
  const { currentUserId, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // ✅ State để track thời gian còn lại (đếm ngược)
  const [timeRemaining, setTimeRemaining] = useState(0);

  // ✅ CHECK PENDING BOOKING mỗi khi isAuthenticated hoặc currentUserId thay đổi
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      sessionStorage.removeItem("pendingBookingDismissed");
      checkPendingBooking();
    } else {
      setPendingBooking(null);
      setShowDialog(false);
      setTimeRemaining(0);
    }
  }, [isAuthenticated, currentUserId]);

  // ✅ SỬA LẠI: useEffect riêng để SET initial time khi pendingBooking có data
  useEffect(() => {
    if (pendingBooking && pendingBooking.time_remaining) {
      console.log(
        "⏰ Setting initial time from booking:",
        pendingBooking.time_remaining
      );
      setTimeRemaining(pendingBooking.time_remaining);
    }
  }, [pendingBooking]);

  // ✅ SỬA LẠI: useEffect riêng để countdown (chỉ phụ thuộc vào timeRemaining)
  useEffect(() => {
    if (!showDialog || timeRemaining <= 0) {
      console.log("⚠️ Skipping countdown:", { showDialog, timeRemaining });
      return;
    }

    console.log("✅ Starting countdown from:", timeRemaining);

    const interval = setInterval(() => {
      console.log("⏱️ Countdown tick");
      setTimeRemaining((prev) => {
        console.log("📉 Current time:", prev);
        if (prev <= 1) {
          console.log("⏰ Time expired!");
          clearInterval(interval);
          setShowDialog(false);
          setPendingBooking(null);
          alert("Booking has expired!");
          return 0;
        }
        const newTime = prev - 1;
        console.log("📉 New time:", newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      console.log("🧹 Cleaning up countdown interval");
      clearInterval(interval);
    };
  }, [showDialog, timeRemaining]); // ✅ Dependency: showDialog và timeRemaining (initial value)

  const checkPendingBooking = async () => {
    const dismissed = sessionStorage.getItem("pendingBookingDismissed");
    if (dismissed === "true") {
      console.log("ℹ️ User đã dismiss dialog trong session này");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("🔍 Checking pending booking...");

      const response = await fetch(
        "http://127.0.0.1:8000/api/bookings/check-pending-all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🔍 Response status:", response.status);

      const result = await response.json();
      console.log("🔍 API Result:", result);

      if (result.success && result.has_pending) {
        console.log("✅ Pending booking found!", result.booking);
        setPendingBooking(result.booking);
        setShowDialog(true);
        // ✅ Không set timeRemaining ở đây nữa, để useEffect khác xử lý
      } else {
        console.log("ℹ️ No pending booking");
        sessionStorage.removeItem("pending_booking");
      }
    } catch (error) {
      console.error("❌ Error checking pending booking:", error);
    }
  };

  const handleContinue = () => {
    if (!pendingBooking) return;

    const { movie_id, showtime_id, booking_id } = pendingBooking;

    setShowDialog(false);

    navigate(`/movies/${movie_id}`, {
      state: {
        resumeBooking: true,
        bookingId: booking_id,
        showtimeId: showtime_id,
      },
    });
  };

  const handleCancel = async () => {
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
        setShowDialog(false);
        setTimeRemaining(0);
        alert("Booking cancelled!");
      } else {
        alert(result.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling booking");
    }
  };

  const handleDismiss = () => {
    setShowDialog(false);
    setTimeRemaining(0);
    sessionStorage.setItem("pendingBookingDismissed", "true");
  };

  if (!showDialog || !pendingBooking) return null;

  // ✅ Format thời gian từ state countdown
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="global-pending-dialog-overlay">
      <div className="global-pending-dialog">
        <div className="dialog-header">
          <h3>⏰ Pending Booking</h3>
          <button className="close-btn" onClick={handleDismiss}>
            ×
          </button>
        </div>

        <div className="dialog-content">
          <p className="movie-info">
            <strong>Movie:</strong> {pendingBooking.movie_title}
          </p>
          <p className="showtime-info">
            <strong>Showtime:</strong> {pendingBooking.showtime_display}
          </p>
          <p className="seats-info">
            <strong>Selected Seats:</strong> {pendingBooking.seats.join(", ")}
          </p>
          <p className="time-info">
            <strong>Remaining Time:</strong>{" "}
            <span
              className={`time-countdown ${
                timeRemaining < 60 ? "time-critical" : ""
              }`}
            >
              {minutes}m {seconds}s
            </span>
          </p>
        </div>

        <div className="dialog-actions">
          <button className="btn-continue" onClick={handleContinue}>
            Continue Booking
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
