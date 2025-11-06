import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NowShowing.css"; // dùng chung CSS

const ComingSoon = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  // ✅ State quản lý trailer modal
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerLink, setTrailerLink] = useState("");

  // ✅ Hàm chuyển link YouTube sang dạng embed
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        // ✅ Lấy phim sắp chiếu (ví dụ: loại trừ 20 phim cuối)
        setMovies(data.slice(0, data.length - 20));
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
    autoplay: false,
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
        {/* --- Header --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-white mb-0">Coming Soon</h2>
          <span
            onClick={() => navigate("/coming-soon")}
            className="text-warning fw-medium"
            style={{ cursor: "pointer" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            See All
          </span>
        </div>

        {/* --- Slider --- */}
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.movie_id} className="px-2">
              <div
                className="card border-0 shadow-sm h-100 position-relative bg-transparent"
                style={{ cursor: "pointer", overflow: "hidden" }}
                onClick={() => navigate(`/movie/${movie.movie_id}`)}
              >
                {/* --- Poster --- */}
                <div
                  className="overflow-hidden position-relative poster-wrapper"
                  style={{ aspectRatio: "2/3" }}
                >
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      transform: "scale(1.01)",
                      display: "block",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1.01)")
                    }
                  />

                  {/* ✅ Hover hiển thị nút trailer (mở modal chứ không mở tab mới) */}
                  {movie.trailer_link && (
                    <div className="trailer-overlay">
                      <div
                        className="play-btn-slider"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTrailerLink(movie.trailer_link);
                          setShowTrailer(true);
                        }}
                      >
                        ▶
                      </div>
                    </div>
                  )}
                </div>

                {/* --- Info --- */}
                <div className="bg-dark text-light px-3 py-2">
                  <h6
                    className="fw-semibold text-truncate mb-1"
                    style={{ fontSize: "0.95rem", color: "#fff" }}
                  >
                    {movie.title}
                  </h6>
                  <p
                    className="text-secondary small mb-0"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {movie.genres?.map((g) => g.name).join(" | ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* --- Modal trailer overlay --- */}
      {showTrailer && trailerLink && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div
            className="trailer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getEmbedUrl(trailerLink)}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
