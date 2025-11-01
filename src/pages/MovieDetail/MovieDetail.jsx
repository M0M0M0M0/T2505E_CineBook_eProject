import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";
import ShowtimeSelector from "../TicketBooking/ShowtimeSelector";
import BookingSection from "../TicketBooking/BookingSection";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [step, setStep] = useState("detail");
  const [embedTrailer, setEmbedTrailer] = useState("");

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
  const handleSelectShowtime = () => setStep("seat");

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
        {/* ---------- HEADER ---------- */}
        <div
          className="movie-detail-header row align-items-start"
          style={{ marginBottom: "40px" }}
        >
          {/* Poster */}
          <div className="col-md-4 text-center">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="md-poster img-fluid rounded shadow"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
          <div className="col-md-8">
            <h2 className="md-title mb-3">{movie.title}</h2>

            <p className="md-meta text-secondary mb-2">
              {movie.genre && <>{movie.genre} | </>}⭐ {movie.vote_average}
              {movie.vote_count ? ` (${movie.vote_count} votes)` : ""}
            </p>

            {/* Các thông tin bổ sung */}
            <p className="md-extra mb-1">
              <strong>Thời lượng:</strong>{" "}
              {movie.duration ? `${movie.duration} phút` : "N/A"}
            </p>
            <p className="md-extra mb-4">
              <strong>Ngày phát hành:</strong>{" "}
              {movie.release_date || "Chưa cập nhật"}
            </p>

            {/* Overview */}
            <div
              className="md-overview text-light mb-4"
              style={{ lineHeight: "1.6" }}
            >
              <h5 className="mb-2 text-warning">Tóm tắt nội dung</h5>
              <p>{movie.overview || "Chưa có mô tả"}</p>
            </div>

            {/* Buttons */}
            <div className="md-actions d-flex gap-3 mt-4">
              <button
                className="detail-booknow-btn px-4 py-2"
                onClick={handleBookNow}
              >
                🎟 Đặt vé ngay
              </button>

              {embedTrailer && (
                <button
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Xem trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- SHOWTIME / SEAT SELECTION ---------- */}
        {step === "showtime" && (
          <div className="showtime-section">
            <h3 style={{ color: "white" }}>Bước 1: Chọn suất chiếu</h3>
            <ShowtimeSelector onSelectShowtime={handleSelectShowtime} />
          </div>
        )}

        {step === "seat" && (
          <div className="seat-section">
            <h3 style={{ color: "white" }}>Bước 2: Chọn ghế</h3>
            <BookingSection movieTitle={movie.title} />
          </div>
        )}

        {/* ---------- TRAILER POPUP ---------- */}
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
