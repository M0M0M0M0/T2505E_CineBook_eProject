import React, { useState } from "react";

export default function TheaterForm({
  isAddTheater,
  theaterForm,
  theaterError,
  handleTheaterChange,
  setEditTheater,
  setIsAddTheater,
  onSaved, 
  editTheater,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(theaterError);

  const handleAddTheaterSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/theaters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theaterForm),
      });
      //   console.log("status", res.status);
      //   console.log("headers", [...res.headers.entries()]);
      //   console.log("raw text:", await res.text());
      if (!res.ok) throw new Error("Failed to add theater");
      setIsAddTheater(false);
      setEditTheater(null);
      if (onSaved) onSaved();
    } catch (err) {
      setError("Failed to save theater.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTheaterSave = async () => {
    setLoading(true);
    setError("");
    try {
      const id = editTheater?.theater_id || theaterForm.theater_id;
      console.log("id", id);
      const res = await fetch(`http://127.0.0.1:8000/api/theaters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theaterForm),
      });
      if (!res.ok) throw new Error("Failed to update theater");
      setEditTheater(null);
      setIsAddTheater(false);
      if (onSaved) onSaved();
    } catch (err) {
      setError("Failed to update theater.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded shadow-sm p-4"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <h4 className="mb-4 text-center text-primary fw-semibold">
        {isAddTheater ? "🎬 Add Theater" : "✏️ Edit Theater"}
      </h4>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          isAddTheater ? handleAddTheaterSave() : handleEditTheaterSave();
        }}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold text-primary">
            Theater Name <span className="text-danger">*</span>
          </label>
          <input
            className="form-control border-primary"
            name="theater_name"
            placeholder="Enter theater name"
            value={theaterForm.theater_name}
            onChange={handleTheaterChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-primary">
            City <span className="text-danger">*</span>
          </label>
          <select
            className="form-control"
            name="theater_city"
            value={theaterForm.theater_city}
            onChange={handleTheaterChange}
            required
          >
            <option value="">Select a city</option>
            <option value="Hanoi">Hanoi</option>
            <option value="Ho Chi Minh City">Ho Chi Minh City</option>
            <option value="Da Nang">Da Nang</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold text-primary">
            Address <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control border-primary"
            name="theater_address"
            placeholder="Enter full address"
            value={theaterForm.theater_address}
            onChange={handleTheaterChange}
            rows="3"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label mb-0">
            Number of Room: <span className="fw-semibold">20</span>
          </label>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            💾 Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setEditTheater(null);
              setIsAddTheater(false);
            }}
            disabled={loading}
          >
            ✖ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
