import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ShowtimeTable({
  cities,
  theaters,
  movies,
  selectedCity,
  selectedTheater,
  selectedMovie,
  setSelectedCity,
  setSelectedTheater,
  setSelectedMovie,
  filteredShowtimes,
  onAddShowtime,
  onEditShowtime,
  onDeleteShowtime,
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [localShowtimes, setLocalShowtimes] = useState([]);

  // Load rooms when theater is selected
  useEffect(() => {
    if (selectedTheater) {
      fetch(`http://127.0.0.1:8000/api/theaters/${selectedTheater}/rooms`)
        .then((res) => res.json())
        .then((data) => setRooms(data))
        .catch((err) => console.error("Failed to load rooms:", err));
    } else {
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedTheater]);

  // Load showtimes based on filters
  useEffect(() => {
    handleSearch();
  }, [selectedCity, selectedTheater, selectedMovie, selectedRoom]);

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedMovie) queryParams.append("movie_id", selectedMovie);
      if (selectedTheater) queryParams.append("theater_id", selectedTheater);
      if (selectedRoom) queryParams.append("room_id", selectedRoom);

      const res = await fetch(
        `http://127.0.0.1:8000/api/showtimes?${queryParams}`
      );
      const data = await res.json();
      setLocalShowtimes(data);
    } catch (err) {
      console.error("Failed to load showtimes:", err);
      setLocalShowtimes([]);
    }
  };

  // Filter theaters by selected city
  const filteredTheaters = selectedCity
    ? theaters.filter((t) => t.theater_city === selectedCity)
    : theaters;

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Showtime Management</h4>
        <button className="btn btn-primary" onClick={onAddShowtime}>
          <Plus size={18} className="me-2" />
          Add Showtime
        </button>
      </div>

      {/* Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">City</label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedTheater("");
              setSelectedRoom("");
            }}
          >
            <option value="">All Cities</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Theater</label>
          <select
            className="form-select"
            value={selectedTheater}
            onChange={(e) => {
              setSelectedTheater(e.target.value);
              setSelectedRoom("");
            }}
            disabled={!selectedCity}
          >
            <option value="">All Theaters</option>
            {filteredTheaters.map((theater) => (
              <option key={theater.theater_id} value={theater.theater_id}>
                {theater.theater_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Room</label>
          <select
            className="form-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            disabled={!selectedTheater}
          >
            <option value="">All Rooms</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Movie</label>
          <select
            className="form-select"
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <option value="">All Movies</option>
            {movies.map((movie) => (
              <option key={movie.movie_id} value={movie.movie_id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Showtimes Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Movie</th>
              <th>Theater</th>
              <th>Room</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localShowtimes.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No showtimes found. Use filters or add a new showtime.
                </td>
              </tr>
            ) : (
              localShowtimes.map((showtime) => {
                const movie = movies.find(
                  (m) => m.movie_id === showtime.movie_id
                );
                const theater = theaters.find(
                  (t) => t.theater_id === showtime.theater_id
                );
                const room = rooms.find((r) => r.room_id === showtime.room_id);

                return (
                  <tr key={showtime.showtime_id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {movie?.poster && (
                          <img
                            src={movie.poster}
                            alt={movie?.title}
                            className="rounded me-2"
                            style={{
                              width: "40px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <span>{movie?.title || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{theater?.theater_name || "Unknown"}</td>
                    <td>{room?.room_name || showtime.room_id}</td>
                    <td>{showtime.show_date}</td>
                    <td>{showtime.show_time}</td>
                    <td>{parseInt(showtime.price).toLocaleString()} VND</td>
                    <td>
                      <span
                        className={`badge ${
                          showtime.status === "Available"
                            ? "bg-success"
                            : showtime.status === "Full"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {showtime.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onEditShowtime(showtime)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteShowtime(showtime.showtime_id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-3 text-muted">
        <small>
          Showing {localShowtimes.length} showtime
          {localShowtimes.length !== 1 ? "s" : ""}
        </small>
      </div>
    </div>
  );
}