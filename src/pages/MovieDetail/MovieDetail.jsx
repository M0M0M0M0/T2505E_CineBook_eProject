import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moviesData from "../../assets/json/movies.json";
import "./MovieDetail.css";
import CastCrewList from "./components/CastCrewList";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

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
        poster: new URL(`../../assets/images/${found.poster}`, import.meta.url).href,
        bgImage: new URL(`../../assets/images/${found.bgImage}`, import.meta.url).href,
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
            {/* ✅ Đổi poster -> movie.poster */}
            <img src={movie.poster} alt={movie.title} className="md-poster" />

            <div className="md-info">
              <h2 className="md-title">{movie.title}</h2>
              <p className="md-meta">
                {movie.genre.join(", ")} | ⭐ {movie.rating} | ⏱ {movie.duration}
              </p>
              <p className="md-synopsis">{movie.synopsis}</p>

              <CastCrewList cast={movie.cast || []} crew={movie.crew || []} />

              <div className="md-actions">
                <a href="#" className="md-book-now">
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

          {/* ✅ Trailer hiển thị trong modal */}
          {showTrailer && movie.trailer && (
            <div className="trailer-modal-overlay" onClick={() => setShowTrailer(false)}>
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
