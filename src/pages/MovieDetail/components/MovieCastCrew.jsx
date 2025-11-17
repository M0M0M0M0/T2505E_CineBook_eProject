import React, { useState, useEffect } from "react";
import "./MovieCastCrew.css";
import defaultCastImage from "./cast.jpg"; // Import ảnh mặc định

export default function MovieCastCrew({ movieId }) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllActors, setShowAllActors] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    const fetchCredits = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${movieId}/credits`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const result = await response.json();

        if (result.success) {
          setCredits(result.data);
          console.log("Credits data:", result.data); // Debug: xem dữ liệu
        } else {
          throw new Error(result.message || "Unknown error");
        }
      } catch (err) {
        console.error("Error fetching credits:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchCredits();
      setImageErrors(new Set()); // Reset image errors khi đổi movie
    }
  }, [movieId]);

  const getProfileImage = (profilePath) => {
    // Nếu không có profile_path, trả về ảnh mặc định
    if (!profilePath) {
      return defaultCastImage;
    }

    // Nếu đã là URL đầy đủ
    if (profilePath.startsWith("http")) {
      return profilePath;
    }

    // URL từ TMDB
    return `https://image.tmdb.org/t/p/w185${profilePath}`;
  };

  const handleImageError = (e, personId) => {
    // Chỉ thay thế 1 lần để tránh loop
    if (!imageErrors.has(personId)) {
      setImageErrors((prev) => new Set([...prev, personId]));
      e.target.src = defaultCastImage; // Dùng ảnh mặc định thay vì placeholder
      e.target.onerror = null; // Ngăn không cho trigger lại
    }
  };

  if (loading) {
    return (
      <div
        className="cast-crew-loading"
        style={{ textAlign: "center", padding: "20px", color: "#fff" }}
      >
        <p>Loading cast & crew...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="cast-crew-error"
        style={{ textAlign: "center", padding: "20px", color: "#ff6b6b" }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  if (
    !credits ||
    (credits.actors_count === 0 && credits.directors_count === 0)
  ) {
    return (
      <div
        className="cast-crew-empty"
        style={{ textAlign: "center", padding: "20px", color: "#999" }}
      >
        <p>No cast & crew information available</p>
      </div>
    );
  }

  const displayedActors = showAllActors
    ? credits.actors
    : credits.actors.slice(0, 8);

  return (
    <div className="movie-cast-crew-section">
      {/* Directors Section */}
      {credits.directors && credits.directors.length > 0 && (
        <div className="directors-section mb-5">
          <h4 className="section-title mb-3" style={{ color: "#ffd54f" }}>
            🎬 Director{credits.directors.length > 1 ? "s" : ""}
          </h4>
          <div className="directors-list">
            {credits.directors.map((director) => (
              <div key={director.cac_id} className="director-card">
                <img
                  src={getProfileImage(director.profile_path)}
                  alt={director.name}
                  className="director-image"
                  onError={(e) =>
                    handleImageError(e, `director-${director.cac_id}`)
                  }
                />
                <div className="director-info">
                  <h5 className="director-name">{director.name}</h5>
                  <p className="director-job">{director.job}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actors Section */}
      {credits.actors && credits.actors.length > 0 && (
        <div className="actors-section">
          <h4 className="section-title mb-3" style={{ color: "#ffd54f" }}>
            🎭 Actors ({credits.actors_count})
          </h4>
          <div className="actors-grid">
            {displayedActors.map((actor) => (
              <div key={actor.cac_id} className="actor-card">
                <img
                  src={getProfileImage(actor.profile_path)}
                  alt={actor.name}
                  className="actor-image"
                  onError={(e) => handleImageError(e, `actor-${actor.cac_id}`)}
                />
                <div className="actor-info">
                  <h5 className="actor-name">{actor.name}</h5>
                  {actor.character && (
                    <p className="actor-character">as {actor.character}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {credits.actors.length > 8 && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-light"
                onClick={() => setShowAllActors(!showAllActors)}
              >
                {showAllActors
                  ? "Show Less"
                  : `Show All ${credits.actors_count} Actors`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
