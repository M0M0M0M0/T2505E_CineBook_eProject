import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  const handleCardClick = (e) => {
    // Nếu người dùng click vào nút play hoặc nút mua vé thì không chuyển trang
    if (
      e.target.closest(".play-btn") ||
      e.target.closest(".buy-btn")
    ) {
      return;
    }
    navigate(`/movie/${movie.id}`); // điều hướng sang trang chi tiết
  };

  return (
    <>
      <div className="movie-card" onClick={handleCardClick}>
        <div className="poster-container">
          <img src={movie.img} alt={movie.title} className="poster" />
          <button
            className="play-btn"
            onClick={() => setShowTrailer(true)}
          >
            ▶
          </button>
        </div>

        <button
          className="buy-btn"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          MUA VÉ NGAY 🎟️
        </button>

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-genre">Thể loại phim: {movie.genre}</p>
        </div>
      </div>

      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={
                movie.trailer?.includes("watch?v=")
                  ? movie.trailer.replace("watch?v=", "embed/")
                  : movie.trailer
              }
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </>
  );
}
