import React from "react";
import "./ShowtimeSelector.css";

export default function ShowtimeSelector({ showtimes = [], onSelectShowtime }) {
  return (
    <div className="showtime-section">
      <h3>Chọn rạp và suất chiếu</h3>

      {showtimes.length === 0 ? (
        <p>Hiện chưa có suất chiếu cho phim này.</p>
      ) : (
        showtimes.map((cinema, index) => (
          <div key={index} className="cinema-item">
            <div className="cinema-header">
              <div>
                <h4>{cinema.cinema}</h4>
                <p>
                  {cinema.city} • Ngày chiếu:{" "}
                  <span className="cinema-date">{cinema.date}</span>
                </p>
              </div>
            </div>

            <div className="showtime-list">
              {cinema.times?.map((time, i) => (
                <button
                  key={i}
                  className="showtime-btn"
                  onClick={() => onSelectShowtime({ cinema, time })}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
