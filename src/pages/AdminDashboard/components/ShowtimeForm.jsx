import React, { useState, useEffect } from "react";
import "./ShowtimeForm.css";

export default function ShowtimeForm({
  movies,
  theaters,
  editingShowtime,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    movie_id: "",
    theater_id: "",
    room_id: "",
    date: "",
    start_time: "",
    price: "",
    status: "Available",
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Helper function: Parse datetime từ API về form fields
  const parseDateTimeFromAPI = (datetimeString) => {
    if (!datetimeString) return { date: "", time: "" };

    try {
      const dt = new Date(datetimeString);
      const date = dt.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = dt.toTimeString().split(" ")[0]; // HH:MM:SS
      return { date, time };
    } catch (e) {
      return { date: "", time: "" };
    }
  };

  // Update form when editingShowtime changes
  useEffect(() => {
    if (editingShowtime) {
      // ✅ Parse start_time từ API (ISO format) thành date + time riêng
      const { date, time } = parseDateTimeFromAPI(editingShowtime.start_time);

      setForm({
        movie_id: editingShowtime.movie_id || "",
        theater_id: editingShowtime.theater_id || "",
        room_id: editingShowtime.room_id || "",
        date: date,
        start_time: time,
        price: editingShowtime.base_price || editingShowtime.price || "",
        status: editingShowtime.status || "Available",
      });

      // ✅ Load rooms for the selected theater
      if (editingShowtime.theater_id) {
        fetch(
          `http://127.0.0.1:8000/api/theaters/${editingShowtime.theater_id}/rooms`
        )
          .then((res) => res.json())
          .then((data) => setRooms(data))
          .catch((err) => {
            console.error("Error loading rooms:", err);
            setRooms([]);
          });
      }
    } else {
      // Reset form for new showtime
      setForm({
        movie_id: "",
        theater_id: "",
        room_id: "",
        date: "",
        start_time: "",
        price: "",
        status: "Available",
      });
    }
  }, [editingShowtime]);

  // Load rooms when theater is selected
  useEffect(() => {
    if (form.theater_id && !editingShowtime) {
      // Chỉ load khi không phải editing (tránh load 2 lần)
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/theaters/${form.theater_id}/rooms`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading rooms:", err);
          setRooms([]);
          setLoading(false);
        });
    } else if (!form.theater_id) {
      setRooms([]);
    }
  }, [form.theater_id, editingShowtime]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.movie_id ||
      !form.theater_id ||
      !form.room_id ||
      !form.date ||
      !form.start_time ||
      !form.price
    ) {
      alert("Please fill all required fields");
      return;
    }

    // ✅ Combine date + time thành ISO datetime string
    const startDateTime = `${form.date}T${form.start_time}`;

    // ✅ Tính end_time dựa vào duration của movie (nếu có)
    let endDateTime = null;
    const selectedMovie = movies.find(
      (m) => m.movie_id === parseInt(form.movie_id)
    );

    if (selectedMovie && selectedMovie.duration) {
      // Add movie duration to start time
      const startDate = new Date(startDateTime);
      const endDate = new Date(
        startDate.getTime() + selectedMovie.duration * 60000
      ); // duration in minutes
      endDateTime = endDate.toISOString().slice(0, 19).replace("T", " ");
    }

    // ✅ Prepare data for API
    const showtimeData = {
      movie_id: form.movie_id,
      room_id: form.room_id,
      start_time: startDateTime, // "2025-12-25T14:30:00"
      base_price: form.price,
      status: form.status,
    };

    // ✅ Thêm end_time nếu đã tính được
    if (endDateTime) {
      showtimeData.end_time = endDateTime;
    }

    // Include showtime_id if editing
    if (editingShowtime?.showtime_id) {
      showtimeData.showtime_id = editingShowtime.showtime_id;
    }

    console.log("📤 Submitting showtime data:", showtimeData);
    onSave(showtimeData);
  };

  const handleTheaterChange = (e) => {
    setForm({
      ...form,
      theater_id: e.target.value,
      room_id: "", // Reset room when theater changes
    });
  };

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <h4 className="text-center mb-4 text-dark">
        {editingShowtime ? "Edit Showtime" : "Add New Showtime"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">
              Movie <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={form.movie_id}
              onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
              required
            >
              <option value="">Select Movie</option>
              {movies.slice(-20).map((m) => (
                <option key={m.movie_id} value={m.movie_id}>
                  {m.title}
                  {m.duration ? ` (${m.duration} min)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Theater <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={form.theater_id}
              onChange={handleTheaterChange}
              required
            >
              <option value="">Select Theater</option>
              {theaters.map((t) => (
                <option key={t.theater_id} value={t.theater_id}>
                  {t.theater_name} - {t.theater_city}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              Room <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}
              required
              disabled={!form.theater_id || loading}
            >
              <option value="">
                {loading
                  ? "Loading..."
                  : form.theater_id
                  ? "Select Room"
                  : "Select Theater First"}
              </option>
              {rooms.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name} ({r.room_type})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              Time <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              step="1"
              className="form-control"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Base Price ($) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {editingShowtime ? "Update" : "Create"} Showtime
          </button>
        </div>
      </form>
    </div>
  );
}
