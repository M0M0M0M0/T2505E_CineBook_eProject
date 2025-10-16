// MovieDetail.jsx
// Place: src/pages/MovieDetail/MovieDetail.jsx
// Note: import JSON from src/assets/json/movies.json
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import moviesData from "../../assets/json/movies.json";

import MovieHeader from "./components/MovieHeader";
import SynopsisSection from "./components/SynopsisSection";
import TrailerModal from "./components/TrailerModal";
import CastCrewList from "./components/CastCrewList";
import ReviewSection from "./components/ReviewSection";

import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();

  // Find movie by id (compare as string so both '1' and 1 match)
  const movie = moviesData.find((m) => String(m.id) === String(id));

  // If not found
  if (!movie) {
    return (
      <div className="movie-detail-page movie-detail-notfound">
        <div className="movie-detail-inner container">
          <h2>Movie not found</h2>
          <p>Không tìm thấy phim với id = {id}</p>
          <Link to="/movies" className="md-back-link">Quay lại Movies</Link>
        </div>
      </div>
    );
  }

  // Resolve poster path (JSON stores just filename, e.g. "tga1.jpg")
  // MovieDetail.jsx is in src/pages/MovieDetail -> go to src/assets/images by ../../assets/images
  const posterUrl = new URL(`../../assets/images/${movie.poster}`, import.meta.url).href;

  // Show trailer modal state handled inside TrailerModal toggles (we'll show trigger in header)
  return (
    <div className="movie-detail-page">
      <div className="movie-detail-inner container">
        <MovieHeader
          poster={posterUrl}
          title={movie.title}
          genre={movie.genre}
          rating={movie.rating}
          trailer={movie.trailer} // optional
        />

        <div className="md-main-grid">
          <div className="md-left-col">
            <SynopsisSection text={movie.synopsis} />
            <div style={{ marginTop: 18 }}>
              <CastCrewList cast={movie.cast || []} crew={movie.crew || []} />
            </div>
          </div>

          <aside className="md-right-col">
            <div className="md-book-card">
              <div className="md-price">Rating: <strong>{movie.rating ?? "N/A"}</strong></div>
              <Link to="#" className="md-book-btn">Book Now</Link>
              {movie.trailer && (
                <TrailerModalTrigger videoUrl={movie.trailer} />
              )}
            </div>

            <div className="md-reviews-wrap">
              <ReviewSection movieId={movie.id} initialReviews={movie.reviews || []} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* Small internal helper to open trailer modal from right column (kept local to this file) */
function TrailerModalTrigger({ videoUrl }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="md-trailer-btn" onClick={() => setOpen(true)}>Watch Trailer</button>
      {open && <TrailerModal videoUrl={videoUrl} onClose={() => setOpen(false)} />}
    </>
  );
}
