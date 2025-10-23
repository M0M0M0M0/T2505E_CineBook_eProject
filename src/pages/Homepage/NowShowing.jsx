import React from "react";
import { movies } from "../../components/utilities/constants";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NowShowing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-white mb-0">Now Showing</h2>
          <span
            onClick={() => navigate("/movies")}
            className="text-danger fw-medium text-decoration-none"
            style={{ cursor: "pointer" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            See All
          </span>
        </div>

        {/* Movie Grid */}
        <div className="row g-4">
          {movies.map((movie, i) => (
            <div
              key={i}
              className="col-6 col-md-4 col-xl-3"
              onClick={() => navigate(`/movie/${movie.id || i + 1}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card border-0 shadow-sm h-100">
                {/* Poster */}
                <div
                  className="overflow-hidden"
                  style={{ aspectRatio: "2/3"}}
                >
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Rating Bar */}
                <div className="bg-dark text-white small px-2 py-1 d-flex justify-content-between">
                  <span>
                    Rating {movie.rating}/10
                  </span>
                  <span className="text-secondary">
                    {movie.votes} Recommended
                  </span>
                </div>

                {/* Info */}
                <div className="card-body p-2">
                  <h6 className="fw-semibold text-dark text-truncate mb-1">
                    {movie.title}
                  </h6>
                  <p className="text-muted small mb-0">
                    {movie.genre.replaceAll("/", " | ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NowShowing;

