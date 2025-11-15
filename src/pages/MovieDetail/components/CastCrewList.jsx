import React from "react";
import "./../MovieDetail.css";

export default function CastCrewList({ cast = [], crew = [] }) {
  return (
    <div className="cast-crew-section">
      <h4>Cast & Crew</h4>

      <div className="cast-crew-info">
        {cast.length ? (
          <p>
            <strong>Actors:</strong> {cast.map((c) => c.name).join(", ")}
          </p>
        ) : (
          <p><strong>Actors:</strong> Updating...</p>
        )}

        {crew.length ? (
          <p>
            <strong>Director:</strong>{" "}
            {crew.filter((c) => c.job === "Director").map((d) => d.name).join(", ")}
          </p>
        ) : (
          <p><strong>Director:</strong> Updating...</p>
        )}
      </div>
    </div>
  );
}
