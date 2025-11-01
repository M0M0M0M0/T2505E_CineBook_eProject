import React, { useState, useEffect } from "react";

export default function ShowtimeSelector({ onSelectShowtime }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        // Lấy movie_id từ URL
        const movieId = window.location.pathname.split("/").pop();

        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${movieId}/showtimes`
        );
        if (!response.ok) throw new Error("Failed to fetch showtimes");
        const data = await response.json();
        setShowtimes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  if (loading) return <p>Loading showtimes...</p>;
  if (!showtimes.length) return <p>No showtimes available.</p>;

  return (
    <div>
      {showtimes.map((showtime) => (
        <button
          key={showtime.showtime_id}
          onClick={() => onSelectShowtime(showtime)}
          style={{
            margin: "5px",
            padding: "10px 20px",
            background: "#f90",
            border: "none",
            borderRadius: "5px",
            color: "#000",
            cursor: "pointer",
          }}
        >
          {new Date(showtime.start_time).toLocaleString()} - {showtime.room.room_name} ({showtime.room.theater.theater_name})
        </button>
      ))}
    </div>
  );
}
