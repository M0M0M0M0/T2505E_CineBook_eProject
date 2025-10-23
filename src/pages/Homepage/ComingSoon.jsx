import React from "react";
import { soons } from "../../components/utilities/constants";
import "bootstrap/dist/css/bootstrap.min.css";

const ComingSoon = () => {
  return (
    <div className="w-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-white mb-0">Coming Soon</h2>
        </div>

        {/* Movie Grid */}
        <div className="row g-4">
          {soons.map((soon, i) => (
            <div
              key={i}
              className="col-6 col-md-4 col-xl-3"
              style={{ cursor: "pointer" }}
            >
              <div className="card border-0 shadow-sm h-100">
                {/* Poster */}
                <div className="overflow-hidden" style={{ aspectRatio: "2/3" }}>
                  <img
                    src={soon.img}
                    alt={soon.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      marginBottom: "-1px",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Movie Info */}
                <div className="bg-dark text-light px-3 py-2 border-top border-secondary-subtle">
                  {/* Release Date */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-secondary">Release Date</small>
                    <small className="fw-medium text-white">{soon.date}</small>
                  </div>

                  {/* Title */}
                  <h6
                    className="fw-semibold text-truncate mb-1"
                    style={{ fontSize: "0.95rem", color: "#fff" }}
                  >
                    {soon.title}
                  </h6>

                  {/* Genre */}
                  <p
                    className="text-secondary small mb-0"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {soon.genre.replaceAll("/", " | ")}
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

export default ComingSoon;
