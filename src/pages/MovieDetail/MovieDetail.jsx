import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./MovieDetail.css";
import ShowtimeSelector from "../TicketBooking/ShowtimeSelector";
import BookingSection from "../TicketBooking/BookingSection";
import FoodSelection from "../TicketBooking/FoodSelection";
import TotalSection from "../TicketBooking/TotalSection";
import PaymentSection from "../TicketBooking/PaymentSection";
import { useAuth } from "../../contexts/AuthContext";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ THÊM để nhận state từ navigation
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [step, setStep] = useState("detail");
  const [embedTrailer, setEmbedTrailer] = useState("");

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTotal, setSeatTotal] = useState(0);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [foodTotal, setFoodTotal] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const { currentUserId, isAuthenticated } = useAuth();

  const showtimeRef = useRef(null);
  const seatRef = useRef(null);
  const foodRef = useRef(null);
  const totalRef = useRef(null);
  const paymentRef = useRef(null);

  // ✅ THÊM: Nhận state từ navigation (khi user click "Tiếp tục đặt vé" từ global dialog)
  const resumeBooking = location.state?.resumeBooking;
  const resumeBookingId = location.state?.bookingId;
  const resumeShowtimeId = location.state?.showtimeId;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/movies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie?.trailer_link) {
      if (movie.trailer_link.includes("watch?v=")) {
        setEmbedTrailer(movie.trailer_link.replace("watch?v=", "embed/"));
      } else {
        setEmbedTrailer(movie.trailer_link);
      }
    }
  }, [movie]);

  // Chỉ chạy effect khi CÓ resumeBooking = true
  useEffect(() => {
    if (resumeBooking === true && resumeShowtimeId && resumeBookingId) {
      // Chỉ fetch nếu bookingId tồn tại trong DB
      fetch(`/api/bookings/${resumeBookingId}/validate`).then((res) => {
        if (res.status === 404) return;
        fetchShowtimeAndResume(resumeShowtimeId, resumeBookingId);
      });
    }
  }, [resumeBooking, resumeShowtimeId, resumeBookingId]);

  // ✅ Hàm fetch showtime và resume booking
  const fetchShowtimeAndResume = async (showtimeId, bookingIdToResume) => {
    if (!showtimeId || !bookingIdToResume) {
      console.log("⚠️ Invalid params for resume");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/showtimes/${showtimeId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // ✅ API trả về data trực tiếp, không có wrapper { success, data }
      if (result && result.showtime_id) {
        setSelectedShowtime(result);
        setBookingId(bookingIdToResume);
        setStep("seat");
      } else {
        throw new Error("Invalid showtime data");
      }
    } catch (error) {
      console.error("❌ Error fetching showtime:", error);
      alert("Không thể tải thông tin suất chiếu. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    let ref = null;
    if (step === "showtime") ref = showtimeRef;
    else if (step === "seat") ref = seatRef;
    else if (step === "food") ref = foodRef;
    else if (step === "total") ref = totalRef;
    else if (step === "payment") ref = paymentRef;
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // ✅ Helper function để format date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "TBA";

    try {
      // Nếu là ISO format (2025-11-26T00:00:00.000000Z)
      const date = new Date(dateString);

      // Format thành DD/MM/YYYY hoặc định dạng khác tùy ý
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      // Fallback: chỉ lấy phần YYYY-MM-DD
      return dateString.slice(0, 10);
    }
  };

  // ✅ Kiểm tra xem phim có phải Coming Soon không
  const isComingSoon = () => {
    if (!movie?.release_date) return false;

    const releaseDate = new Date(movie.release_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time để so sánh chỉ ngày

    return releaseDate > today;
  };

  if (!movie)
    return (
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "60px",
          background: "#000",
        }}
      >
        Loading movie details...
      </div>
    );

  const handleBookNow = () => {
    if (!isAuthenticated || !currentUserId) {
      alert("Vui lòng đăng nhập để tiếp tục đặt vé!");
      navigate("/login");
      return;
    }
    setStep("showtime");
  };

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setStep("seat");
  };

  const handleSelectSeats = ({ seats, total, booking_id }) => {
    setSelectedSeats(seats);
    setSeatTotal(total);

    // ✅ Validate booking_id trước khi chuyển step
    if (!booking_id) {
      console.error("❌ No booking_id received");
      alert("Lỗi: Không có booking ID. Vui lòng thử lại từ đầu.");
      setStep("showtime");
      return;
    }

    setBookingId(booking_id);
    if (seats && seats.length > 0) {
      setStep("food");
    }
  };

  const handleSelectFoods = ({ foods, total }) => {
    setSelectedFoods(foods);
    setFoodTotal(total);
    setStep("total");
  };

  const handleNext = () => {
    setStep("transition");
    setTimeout(() => setStep("payment"), 400);
  };

  // ✅ Hàm back từ food về seat - RESET bookingId nếu cần
  const handleBackToSeat = () => {
    // Không reset bookingId ở đây vì user có thể muốn giữ booking
    setStep("seat");
  };
  const handlePaymentSuccess = () => {
    console.log("🎉 Payment successful, clearing all booking data");

    // Reset all booking-related states
    setSelectedSeats([]);
    setSeatTotal(0);
    setSelectedFoods({});
    setFoodTotal(0);
    setBookingId(null);

    // Clear sessionStorage
    if (selectedShowtime?.showtime_id) {
      sessionStorage.removeItem(`booking_${selectedShowtime.showtime_id}`);
      sessionStorage.removeItem(`went_to_food_${selectedShowtime.showtime_id}`);
    }

    // Return to movie detail view
    setStep("detail");
  };

  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div className="movie-detail-inner container">
        {/* HEADER */}
        <div
          className="movie-detail-header row align-items-start"
          style={{ marginBottom: "40px" }}
        >
          <div className="col-md-4 text-center">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="md-poster img-fluid rounded shadow"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <h2 className="md-title mb-3">{movie.title}</h2>

            {/* ✅ Hiển thị badge Coming Soon nếu phim chưa ra */}
            {isComingSoon() && (
              <span className="badge bg-warning text-dark me-2 mb-2">
                Coming Soon
              </span>
            )}

            <p className="md-meta text-secondary mb-2">
              {movie.genre && <>{movie.genre} | </>}⭐ {movie.vote_average}
              {movie.vote_count ? ` (${movie.vote_count} votes)` : ""}
            </p>
            <p className="md-extra mb-1">
              <strong>Duration:</strong>{" "}
              {movie.duration ? `${movie.duration} minutes` : "N/A"}
            </p>
            <p className="md-extra mb-4">
              <strong>Release Date:</strong>{" "}
              {formatReleaseDate(movie.release_date)}
            </p>

            <div
              className="md-overview text-light mb-4"
              style={{ lineHeight: "1.6" }}
            >
              <h5 className="mb-2 movie-detail-overview">Plot Summary</h5>
              <p>{movie.overview || "Chưa có mô tả"}</p>
            </div>

            <div className="md-actions d-flex gap-3 mt-4">
              {/* ✅ Chỉ hiển thị nút Book Now nếu KHÔNG phải Coming Soon */}
              {!isComingSoon() ? (
                <button
                  className="detail-booknow-btn px-4 py-2"
                  onClick={handleBookNow}
                >
                  🎟 Book Now
                </button>
              ) : (
                <button
                  className="btn btn-secondary px-4 py-2"
                  disabled
                  title="This movie is not available for booking yet"
                >
                  Coming Soon
                </button>
              )}

              {embedTrailer && (
                <button
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STEPS */}
        {step === "showtime" && (
          <div className="showtime-section" ref={showtimeRef}>
            <h3 style={{ color: "white" }}>Step 1: Showtime</h3>
            <ShowtimeSelector onSelectShowtime={handleSelectShowtime} />
          </div>
        )}

        {step === "seat" && (
          <div className="seat-section" ref={seatRef}>
            <h3 style={{ color: "white" }}>Step 2: Seat</h3>
            <BookingSection
              movieTitle={movie?.title}
              selectedShowtime={selectedShowtime}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              onSelectSeats={handleSelectSeats}
              onBack={() => setStep("showtime")}
              showtimeId={selectedShowtime.showtime_id}
              currentUserId={currentUserId}
              bookingId={bookingId}
              setBookingId={setBookingId}
            />
          </div>
        )}

        {step === "food" && (
          <div className="food-section" ref={foodRef}>
            <h3 style={{ color: "white" }}>Step 3: Food</h3>
            <FoodSelection
              bookingId={bookingId}
              selectedSeats={selectedSeats}
              seatTotal={seatTotal}
              selectedFoods={selectedFoods}
              setSelectedFoods={setSelectedFoods}
              onComplete={handleSelectFoods}
              onBack={handleBackToSeat}
            />
          </div>
        )}

        {step === "total" && (
          <div className="total-section" ref={totalRef}>
            <h3 style={{ color: "white" }}>Step 4: Total</h3>
            <TotalSection
              movieTitle={movie.title}
              selectedShowtime={selectedShowtime}
              selectedSeats={selectedSeats}
              seatTotal={seatTotal}
              selectedFoods={selectedFoods}
              foodTotal={foodTotal}
              onBack={() => setStep("food")}
              onNext={() => setStep("payment")}
            />
          </div>
        )}

        {step === "payment" && (
          <div className="total-section" ref={paymentRef}>
            <h3 style={{ color: "white" }}>Step 5: Payment</h3>
            <PaymentSection
              showtimeId={selectedShowtime.showtime_id}
              setBookingId={setBookingId}
              bookingId={bookingId}
              movieTitle={movie.title}
              selectedShowtime={selectedShowtime}
              selectedSeats={selectedSeats}
              seatTotal={seatTotal}
              selectedFoods={selectedFoods}
              foodTotal={foodTotal}
              onBack={() => setStep("total")}
              onFinish={handlePaymentSuccess}
            />
          </div>
        )}

        {/* TRAILER POPUP */}
        {showTrailer && embedTrailer && (
          <div
            className="trailer-modal-overlay"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="trailer-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={embedTrailer}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
