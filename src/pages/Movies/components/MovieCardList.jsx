import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCardList.css";

export default function MovieCardList({ movies = [] }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  // ✅ Hàm chuyển đổi link YouTube thành embed link
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    // nếu là link dạng watch?v= thì đổi sang embed/
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    // nếu là link share ngắn youtu.be
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  const openTrailer = (url) => {
    setCurrentTrailer(convertToEmbedUrl(url)); // ✅ tự động chuyển link
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setCurrentTrailer(null);
  };

  return (
    <div className="movie-card-list">
      {movies.map((movie) => (
        <div className="movie-card-unique" key={movie.id}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-card-unique-poster"
          />

          <h3 className="movie-card-unique-title">{movie.title}</h3>
          <p className="movie-card-unique-meta">
            {movie.genre.join(", ")} | ⭐ {movie.rating}
          </p>

          <div className="movie-card-unique-actions">
            <Link to={`/movies/${movie.id}`} className="movie-card-unique-link">
              View Detail
            </Link>

            {movie.trailer && (
              <button
                className="movie-card-unique-trailer"
                onClick={() => openTrailer(movie.trailer)}
              >
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>
      ))}

      {/* ✅ Trailer Modal */}
      {showTrailer && currentTrailer && (
        <div className="trailer-modal-overlay" onClick={closeTrailer}>
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={currentTrailer}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
