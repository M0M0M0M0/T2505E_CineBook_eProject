import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moviesData from "../../assets/json/movies.json";
import "./MovieDetail.css";
import CastCrewList from "./components/CastCrewList";
import BookingSection from "../TicketBooking/BookingSection";
import ShowtimeSelector from "../TicketBooking/ShowtimeSelector";
import { div } from "framer-motion/client";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
    // HandleBookingSection
  const [step, setStep] = useState("detail"); // "detail" | "showtime" | "seat"

  const handleBookNow = () => {
    setStep("showtime");
  };

  const handleSelectShowtime = (showtime) => {
    console.log("User chọn suất chiếu:", showtime);
    setStep("seat");
  };

  // HangleTrailer
  useEffect(() => {
    const found = moviesData.find((m) => m.id === Number(id));

    if (found) {
      // 🔧 Nếu trailer có dạng "watch?v=" thì tự chuyển sang "embed/"
      const trailerUrl = found.trailer?.includes("watch?v=")
        ? found.trailer.replace("watch?v=", "embed/")
        : found.trailer;

      // ✅ Gán lại vào state với đường dẫn ảnh & trailer đã xử lý
      setMovie({
        ...found,
        poster: new URL(`../../assets/images/${found.poster}`, import.meta.url)
          .href,
        bgImage: new URL(
          `../../assets/images/${found.bgImage}`,
          import.meta.url
        ).href,
        trailer: trailerUrl,
      });
    }
  }, [id]);

  if (!movie)
    return (
      <div
        className="movie-detail-page"
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



  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundImage: `url(${movie.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="movie-detail-overlay">
        <div className="movie-detail-inner container">
          <div className="movie-detail-header">
            <img src={movie.poster} alt={movie.title} className="md-poster" />

            <div className="md-info">
              <h2 className="md-title">{movie.title}</h2>

              <p className="md-meta">
                {movie.genre?.join(", ")} {movie.genre ? " | " : ""}⭐{" "}
                {movie.rating} {movie.duration ? " | ⏱ " + movie.duration : ""}
              </p>

              {/* ✅ Các thông tin chi tiết nằm ngay bên dưới meta */}
              <div className="md-extra-info">
                <p>
                  <strong>Director:</strong> {movie.director || "N/A"}
                </p>
                <p>
                  <strong>Actors:</strong>{" "}
                  {Array.isArray(movie.cast)
                    ? movie.cast.map((c) => (c.name ? c.name : c)).join(", ")
                    : movie.cast || "N/A"}
                </p>
                <p>
                  <strong>Language:</strong> {movie.language || "N/A"}
                </p>
                <p>
                  <strong>Age Rating:</strong> {movie.ageRating || "N/A"}
                </p>
                <p>
                  <strong>Release Date:</strong> {movie.releaseDate || "N/A"}
                </p>
              </div>

              <div className="md-actions">
                <a href="#" className="md-book-now" onClick={handleBookNow}>
                  🎟 Book Now
                </a>
                <button
                  className="md-trailer-inline"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Watch Trailer
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Hiển thị phần tóm tắt nếu chưa nhấn Book Now */}
          {step === "detail" && (
            <>
              <div className="md-synopsis-section">
                <h4>Synopsis</h4>
                <p className="md-synopsis">{movie.synopsis}</p>
              </div>
              <CastCrewList cast={movie.cast} crew={movie.crew} />
            </>
          )}

          {/* ✅ Khi nhấn Book Now → hiện component chọn suất chiếu */}
          {step === "showtime" && (
            <div>
            <h3 style={{ color: "white" }}>Bước 1: Chọn suất chiếu</h3>
            <ShowtimeSelector
              showtimes={movie.showtimes}
              onSelectShowtime={handleSelectShowtime}
            />
            </div>
          )}

          {/* ✅ Khi chọn suất chiếu → chuyển sang bước chọn ghế */}
          {step === "seat" && (
            <div>
              <h3 style={{ color: "white" }}>Bước 2: Chọn ghế</h3>
              <BookingSection movieTitle={movie.title} />
              
            </div>
          )}

          {/* ✅ Trailer hiển thị trong modal */}
          {showTrailer && movie.trailer && (
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
                  src={movie.trailer}
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
    </div>
  );
}
