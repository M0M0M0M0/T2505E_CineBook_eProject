import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";
import ShowtimeSelector from "../TicketBooking/ShowtimeSelector";
import BookingSection from "../TicketBooking/BookingSection";
import FoodSelection from "../TicketBooking/FoodSelection";
import TotalSection from "../TicketBooking/TotalSection";
import PaymentSection from "../TicketBooking/PaymentSection";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [step, setStep] = useState("detail"); // detail → showtime → seat → food → toal → payment
  const [embedTrailer, setEmbedTrailer] = useState("");

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTotal, setSeatTotal] = useState(0);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [foodTotal, setFoodTotal] = useState(0);

  // Tạo ref cho từng section
  const showtimeRef = useRef(null);
  const seatRef = useRef(null);
  const foodRef = useRef(null);
  const totalRef = useRef(null);
  const paymentRef = useRef(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${id}`
        );
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

  useEffect(() => {
    // Scroll tới đúng section khi step thay đổi
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

  const handleBookNow = () => setStep("showtime");

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setStep("seat");
  };

  const handleSelectSeats = ({ seats, total }) => {
    setSelectedSeats(seats);
    setSeatTotal(total);
    setStep("food");
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
            <p className="md-meta text-secondary mb-2">
              {movie.genre && <>{movie.genre} | </>}⭐ {movie.vote_average}
              {movie.vote_count ? ` (${movie.vote_count} votes)` : ""}
            </p>
            <p className="md-extra mb-1">
              <strong>Thời lượng:</strong>{" "}
              {movie.duration ? `${movie.duration} phút` : "N/A"}
            </p>
            <p className="md-extra mb-4">
              <strong>Ngày phát hành:</strong>{" "}
              {movie.release_date || "Chưa cập nhật"}
            </p>

            <div
              className="md-overview text-light mb-4"
              style={{ lineHeight: "1.6" }}
            >
              <h5 className="mb-2 movie-detail-overview">Tóm tắt nội dung</h5>
              <p>{movie.overview || "Chưa có mô tả"}</p>
            </div>

            <div className="md-actions d-flex gap-3 mt-4">
              <button
                className="detail-booknow-btn px-4 py-2"
                onClick={handleBookNow}
              >
                🎟 Book Now
              </button>

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
              movieTitle={movie.title}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              onSelectSeats={handleSelectSeats}
              onBack={() => setStep("showtime")}
            />
          </div>
        )}

        {step === "food" && (
          <div className="food-section" ref={foodRef}>
            <h3 style={{ color: "white" }}>Step 3: Food</h3>
            <FoodSelection
              selectedSeats={selectedSeats}
              seatTotal={seatTotal}
              selectedFoods={selectedFoods}
              setSelectedFoods={setSelectedFoods}
              onComplete={handleSelectFoods}
              onBack={() => setStep("seat")}
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
              movieTitle={movie.title}
              selectedShowtime={selectedShowtime}
              selectedSeats={selectedSeats}
              seatTotal={seatTotal}
              selectedFoods={selectedFoods}
              foodTotal={foodTotal}
              onBack={() => setStep("total")}
              onFinish={() => setStep("done")}
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
