import React, { useState } from "react";

export default function ShowtimeForm({
  movies,
  theaters,
  rooms,
  editingShowtime,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(
    editingShowtime || {
      movie_id: "",
      theater_id: "",
      room_id: "",
      date: "",
      start_time: "",
      price: "",
      status: "Available",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <h4 className="text-center mb-4">
        {editingShowtime ? "Edit Showtime" : "Add New Showtime"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Movie</label>
            <select
              className="form-select"
              value={form.movie_id}
              onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
              required
            >
              <option value="">Select Movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Theater</label>
            <select
              className="form-select"
              value={form.theater_id}
              onChange={(e) => setForm({ ...form, theater_id: e.target.value })}
              required
            >
              <option value="">Select Theater</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Room</label>
            <select
              className="form-select"
              value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}
              required
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price (VND)</label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
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
              <option>Available</option>
              <option>Full</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
