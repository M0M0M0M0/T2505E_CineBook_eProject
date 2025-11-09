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

  // Update form when editingShowtime changes
  useEffect(() => {
    if (editingShowtime) {
      setForm({
        movie_id: editingShowtime.movie_id || "",
        theater_id: editingShowtime.theater_id || "",
        room_id: editingShowtime.room_id || "",
        // Map API fields to form fields
        date: editingShowtime.show_date || editingShowtime.date || "",
        start_time:
          editingShowtime.show_time || editingShowtime.start_time || "",
        price: editingShowtime.price || "",
        status: editingShowtime.status || "Available",
      });
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
    if (form.theater_id) {
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
    } else {
      setRooms([]);
    }
  }, [form.theater_id]);

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

    // Prepare data for API (map back to API format)
    const showtimeData = {
      ...form,
      show_date: form.date,
      show_time: form.start_time,
    };

    // Include showtime_id if editing
    if (editingShowtime?.showtime_id) {
      showtimeData.showtime_id = editingShowtime.showtime_id;
    }

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
              {movies.map((m) => (
                <option key={m.movie_id} value={m.movie_id}>
                  {m.title}
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
              step="1"
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
