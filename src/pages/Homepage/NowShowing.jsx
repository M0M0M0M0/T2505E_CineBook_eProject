import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NowShowing.css";

const NowShowing = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        // ✅ Lấy 20 phim cuối cùng
        setMovies(data.slice(-20));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    dots: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-white mb-0">Now Showing</h2>
          <span
            onClick={() => navigate("/movies")}
            className="text-warning fw-medium"
            style={{ cursor: "pointer" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            See All
          </span>
        </div>

        {/* Slider */}
        <Slider {...settings}>
          {movies.map((movie) => {
            // ✅ Bảo vệ dữ liệu để tránh lỗi .toFixed()
            const rating = movie.vote_average
              ? Number(movie.vote_average).toFixed(1)
              : "N/A";
            const genres = movie.genres
              ? movie.genres.map((g) => g.name).join(" | ")
              : "N/A";

            return (
              <div key={movie.movie_id} className="px-2">
                <div
                  className="card border-0 shadow-sm h-100"
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Poster */}
                  <div className="overflow-hidden" style={{ aspectRatio: "2/3" }}>
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        transform: "scale(1.01)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1.01)")
                      }
                    />
                  </div>

                  {/* Info */}
                  <div className="bg-dark text-light px-3 py-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold">⭐ {rating}/10</span>
                      <small className="text-secondary">
                        {movie.vote_count || 0} votes
                      </small>
                    </div>

                    <h6
                      className="fw-semibold text-truncate mb-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {movie.title}
                    </h6>

                    <p
                      className="text-secondary small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {genres}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default NowShowing;
