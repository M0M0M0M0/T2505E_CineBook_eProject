import React from 'react';
import './MovieCardList.css';

function MovieCardList({ movies }) {
  return (
    <div className="movie-card-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img src={movie.poster} alt={movie.title} className="movie-card-poster" />
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-info">
            Genre: {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre
} | Rating: {movie.rating}
          </p>
          {/* Link đến trang chi tiết phim */}
          <a href={`/movies/${movie.id}`} className="movie-card-detail-link">View Details</a>
        </div>
      ))}
    </div>
  );
}

export default MovieCardList;