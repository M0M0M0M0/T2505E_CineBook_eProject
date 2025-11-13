import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, RefreshCw, AlertCircle } from "lucide-react";
import "./ShowtimeForm.css";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // ✅ Load showtimes only when theater is selected
  useEffect(() => {
    if (selectedTheater) {
      handleSearch();
    } else {
      setLocalShowtimes([]);
    }
  }, [selectedTheater, selectedMovie, selectedRoom]);

  const handleSearch = async () => {
    // ✅ Don't search if no theater selected
    if (!selectedTheater) {
      setError("Please select a theater first");
      setLocalShowtimes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("theater_id", selectedTheater); // ✅ Always include theater_id

      if (selectedMovie) queryParams.append("movie_id", selectedMovie);
      if (selectedRoom) queryParams.append("room_id", selectedRoom);

      const res = await fetch(
        `http://127.0.0.1:8000/api/showtimes?${queryParams}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setLocalShowtimes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load showtimes:", err);
      setError("Failed to load showtimes. Please try again.");
      setLocalShowtimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter theaters by selected city
  const filteredTheaters = selectedCity
    ? theaters.filter((t) => t.theater_city === selectedCity)
    : theaters;

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-dark mb-0">Showtime Management</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={handleSearch}
            disabled={!selectedTheater || loading}
            title="Refresh showtimes"
          >
            <RefreshCw size={16} className="me-2" />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={onAddShowtime}
          >
            <Plus size={16} className="me-2" />
            Add Showtime
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedTheater("");
              setSelectedRoom("");
              setLocalShowtimes([]);
            }}
          >
            <option value="">Select City</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">
            Theater <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={selectedTheater}
            onChange={(e) => {
              setSelectedTheater(e.target.value);
              setSelectedRoom("");
            }}
            disabled={!selectedCity}
          >
            <option value="">Select Theater</option>
            {filteredTheaters.map((theater) => (
              <option key={theater.theater_id} value={theater.theater_id}>
                {theater.theater_name}
              </option>
            ))}
          </select>
          {!selectedCity && (
            <small className="text-muted">Please select a city first</small>
          )}
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
            disabled={!selectedTheater}
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

      {/* ✅ Warning message when no theater selected */}
      {!selectedTheater && (
        <div
          className="alert alert-info d-flex align-items-center"
          role="alert"
        >
          <AlertCircle size={20} className="me-2" />
          <div>
            Please select a <strong>City</strong> and <strong>Theater</strong>{" "}
            to view showtimes.
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Showtimes Table */}
      {selectedTheater && (
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">Loading showtimes...</div>
                  </td>
                </tr>
              ) : localShowtimes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No showtimes found for this theater.
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
                  const room = rooms.find(
                    (r) => r.room_id === showtime.room_id
                  );

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
                      <td>${showtime.price}</td>
                      <td>
                        <span
                          className={`badge ${
                            showtime.status === "available"
                              ? "bg-success"
                              : showtime.status === "full"
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
                          title="Edit showtime"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDeleteShowtime(showtime.showtime_id)}
                          title="Delete showtime"
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
      )}

      {/* Summary */}
      {selectedTheater && !loading && (
        <div className="mt-3 text-muted">
          <small>
            Showing {localShowtimes.length} showtime
            {localShowtimes.length !== 1 ? "s" : ""}
          </small>
        </div>
      )}
    </div>
  );
}
