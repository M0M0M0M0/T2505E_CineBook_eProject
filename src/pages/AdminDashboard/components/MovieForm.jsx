import React, { useEffect, useState } from "react";

export default function MovieForm({
  isAddMovie,
  editForm,
  editError,
  handleEditChange,
  handleAddSave,
  handleEditSave,
  handleAddCancel,
  handleEditCancel,
}) {
  const [genresList, setGenresList] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/genres")
      .then((res) => res.json())
      .then((data) => setGenresList(data))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  useEffect(() => {
    if (editForm.genres && editForm.genres.length > 0 && typeof editForm.genres[0] === "object") {
      handleEditChange({
        target: {
          name: "genres",
          value: editForm.genres.map((g) => g.genre_id),
        },
      });
    }
  }, [editForm.genres]);

  return (
    <div className="border rounded p-3 mt-4" style={{ color: "#000" }}>
      <h6 className="fw-bold mb-3">
        {isAddMovie ? "Add film" : "Update film"}
      </h6>

      {editError && <div className="alert alert-danger py-2">{editError}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          isAddMovie ? handleAddSave() : handleEditSave();
        }}
      >
        {/* Movie ID */}
        <div className="mb-3">
          <label className="form-label">
            Movie ID <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="movie_id"
            value={editForm.movie_id || ""}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">
            Title <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="title"
            value={editForm.title || ""}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Original Title */}
        <div className="mb-3">
          <label className="form-label">Original Title</label>
          <input
            className="form-control"
            name="original_title"
            value={editForm.original_title || ""}
            onChange={handleEditChange}
          />
        </div>

        {/* Original Language */}
        <div className="mb-3">
          <label className="form-label">Original Language</label>
          <input
            className="form-control"
            name="original_language"
            value={editForm.original_language || ""}
            onChange={handleEditChange}
          />
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">
            Duration <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="duration"
            value={editForm.duration || ""}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Poster Path */}
        <div className="mb-3">
          <label className="form-label">
            Poster Path  <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="poster_path"
            value={editForm.poster_path || ""}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Backdrop Path */}
        <div className="mb-3">
          <label className="form-label">Backdrop Path </label>
          <input
            className="form-control"
            name="backdrop_path"
            value={editForm.backdrop_path || ""}
            onChange={handleEditChange}
          />
        </div>

        {/* Trailer */}
        <div className="mb-3">
          <label className="form-label">Trailer Link</label>
          <input
            className="form-control"
            name="trailer_link"
            value={editForm.trailer_link || ""}
            onChange={handleEditChange}
          />
        </div>

        {/* Genres */}
        <div className="mb-3">
          <label className="form-label">Genres</label>
          <div className="d-flex flex-wrap gap-2">
            {genresList.length > 0 ? (
              genresList.map((genre) => (
                <div key={genre.genre_id} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`genre-${genre.genre_id}`}
                    checked={Array.isArray(editForm.genres) && editForm.genres.includes(genre.genre_id)}

                    onChange={(e) => {
                      const selected = Array.isArray(editForm.genres)
                        ? [...editForm.genres]
                        : [];

                      if (e.target.checked) {
                        selected.push(genre.genre_id);
                      } else {
                        const idx = selected.indexOf(genre.genre_id);
                        if (idx > -1) selected.splice(idx, 1);
                      }

                      handleEditChange({
                        target: { name: "genres", value: selected },
                      });
                    }}
                  />
                  <label
                    className="form-check-label ms-1"
                    htmlFor={`genre-${genre.genre_id}`}
                  >
                    {genre.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">Loading genres...</p>
            )}
          </div>
        </div>



        {/* Overview */}
        <div className="mb-3">
          <label className="form-label">
            Overview <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            rows="4"
            name="overview"
            value={editForm.overview || ""}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Release Date */}
        <div className="mb-3">
          <label className="form-label">
            Release Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            name="release_date"
            value={
              editForm.release_date
                ? editForm.release_date.slice(0, 10) // cắt chuỗi ISO "YYYY-MM-DDTHH:MM:SSZ" thành "YYYY-MM-DD"
                : ""
            }
            onChange={handleEditChange}
            required
          />

        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={isAddMovie ? handleAddCancel : handleEditCancel}
          >
            Cancle
          </button>
        </div>
      </form>
    </div>
  );
}
