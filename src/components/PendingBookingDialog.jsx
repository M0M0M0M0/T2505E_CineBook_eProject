import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./PendingBookingDialog.css";

export default function PendingBookingDialog() {
  const { currentUserId, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // ✅ CHECK PENDING BOOKING mỗi khi isAuthenticated hoặc currentUserId thay đổi
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      // ✅ Reset dismissed flag khi user mới đăng nhập
      sessionStorage.removeItem("pendingBookingDismissed");
      checkPendingBooking();
    } else {
      // ✅ Reset state khi user logout
      setPendingBooking(null);
      setShowDialog(false);
    }
  }, [isAuthenticated, currentUserId]);

  const checkPendingBooking = async () => {
    // ✅ Kiểm tra xem user đã dismiss chưa (trong session hiện tại)
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
        console.log("✅ Pending booking found!");
        setPendingBooking(result.booking);
        setShowDialog(true);
      } else {
        console.log("ℹ️ No pending booking");
      }
    } catch (error) {
      console.error("❌ Error checking pending booking:", error);
    }
  };

  const handleContinue = () => {
    if (!pendingBooking) return;

    // Điều hướng đến trang chi tiết phim với booking đang chờ
    const { movie_id, showtime_id, booking_id } = pendingBooking;

    setShowDialog(false);

    // Navigate với state chứa thông tin booking
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
        alert("Booking đã được hủy thành công!");
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
    // ✅ Set flag để không hiển thị lại trong session này
    sessionStorage.setItem("pendingBookingDismissed", "true");
  };

  if (!showDialog || !pendingBooking) return null;

  // Format thời gian còn lại
  const timeRemaining = pendingBooking.time_remaining || 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="global-pending-dialog-overlay">
      <div className="global-pending-dialog">
        <div className="dialog-header">
          <h3>⏰ Bạn có booking đang chờ!</h3>
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
            <span className="time-countdown">
              {minutes} minutes {seconds} seconds
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
          <button className="btn-dismiss" onClick={handleDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
