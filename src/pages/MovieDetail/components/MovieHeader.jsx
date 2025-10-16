// MovieHeader.jsx
import React from "react";
import "./../MovieDetail.css"; // we use single CSS file

import { Link } from "react-router-dom";

export default function MovieHeader({ poster, title, genre, rating, trailer }) {
  return (
    <header className="movie-detail-header">
      <img src={poster} alt={title} className="md-poster" />
      <div className="md-info">
        <h1 className="md-title">{title}</h1>
        <div className="md-meta">{genre} | Rating: {rating ?? "N/A"}</div>
        <div className="md-actions">
          <Link to="#" className="md-book-now">Book Now</Link>
          {trailer && (
            <button className="md-trailer-inline" onClick={() => {
              // dispatch an event so parent can open a modal (simple approach)
              window.dispatchEvent(new CustomEvent("open-trailer", { detail: { videoUrl: trailer } }));
            }}>
              Watch Trailer
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
