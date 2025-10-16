// CastCrewList.jsx
// Hiển thị danh sách diễn viên (Cast) và ekip (Crew)
// Ảnh được load từ src/assets/images thông qua new URL(..., import.meta.url)

import React from "react";
import "./../MovieDetail.css";

export default function CastCrewList({ cast = [], crew = [] }) {
  return (
    <div className="cast-crew-section">
      {/* === CAST === */}
      <h4>Cast</h4>
      <div className="cast-crew-list">
        {cast.length ? (
          cast.map((c, idx) => {
            // ✅ Đường dẫn ảnh đúng vị trí: src/assets/images/
            const photoURL = c.photo
              ? new URL(`../../../assets/images/${c.photo}`, import.meta.url)
                  .href
              : null;

            return (
              <div className="cast-item" key={idx}>
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={c.name}
                    className="cast-photo"
                  />
                ) : (
                  <div className="cast-photo-placeholder">No Image</div>
                )}

                <div className="cast-name">{c.name}</div>
                <div className="cast-role">{c.role}</div>
              </div>
            );
          })
        ) : (
          <div>No cast listed.</div>
        )}
      </div>

      {/* === CREW === */}
      <h4 style={{ marginTop: 14 }}>Crew</h4>
      <div className="cast-crew-list">
        {crew.length ? (
          crew.map((c, idx) => (
            <div className="cast-item" key={idx}>
              <div className="crew-name">{c.name}</div>
              <div className="crew-job">{c.job}</div>
            </div>
          ))
        ) : (
          <div>No crew listed.</div>
        )}
      </div>
    </div>
  );
}
