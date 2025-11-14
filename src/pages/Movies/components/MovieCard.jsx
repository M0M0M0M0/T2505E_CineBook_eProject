import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie, isComingSoon = false }) {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  const handleCardClick = (e) => {
    // Nếu người dùng click vào nút play hoặc nút mua vé thì không chuyển trang
    if (e.target.closest(".play-btn") || e.target.closest(".buy-btn")) {
      return;
    }
    navigate(`/movies/${movie.movie_id}`);
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
  };
  // console.log("Trailer link value:", movie.trailer_link);
  // console.log("Embed URL:", getEmbedUrl(movie.trailer_link));

  return (
    <>
      {/* --- Movie Card --- */}
      <div className="movie-card" onClick={handleCardClick}>
        <div className="poster-container">
          <img src={movie.img} alt={movie.title} className="poster" />

          <button
            className="play-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowTrailer(true);
            }}
          >
            ▶
          </button>
        </div>

        <button
          className="buy-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie.movie_id}`);
          }}
        >
          {isComingSoon ? "VIEW DETAILS" : "BOOK NOW 🎟️"}
        </button>

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-genre">{movie.genre}</p>
        </div>
      </div>

      {/* --- Trailer Modal (iframe đặt ở đây) --- */}
      {showTrailer && movie.trailer_link && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={getEmbedUrl(movie.trailer_link)}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
