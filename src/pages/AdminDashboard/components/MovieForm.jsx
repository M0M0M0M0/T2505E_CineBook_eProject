import React, { useEffect, useState } from "react";

export default function MovieForm({
  isAddMovie = false,
  editForm = {},
  editError = "",
  handleEditChange = () => {},
  handleAddSave = () => {},
  handleEditSave = () => {},
  handleAddCancel = () => {},
  handleEditCancel = () => {},
}) {
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/genres")
      .then((res) => res.json())
      .then((data) => setGenresList(data))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  
  const normalizedGenres = React.useMemo(() => {
    if (!editForm || !editForm.genres) return [];

    if (Array.isArray(editForm.genres) && editForm.genres.length > 0) {
      if (
        typeof editForm.genres[0] === "object" &&
        editForm.genres[0]?.genre_id
      ) {
        return editForm.genres.map((g) => g.genre_id);
      }
    }

    return Array.isArray(editForm.genres) ? editForm.genres : [];
  }, [editForm?.genres]);

  const handleGenreToggle = (genreId) => {
    const currentGenres = [...normalizedGenres];
    const index = currentGenres.indexOf(genreId);

    if (index > -1) {
      currentGenres.splice(index, 1);
    } else {
      currentGenres.push(genreId);
    }

    handleEditChange({
      target: { name: "genres", value: currentGenres },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAddMovie) {
        await handleAddSave();
      } else {
        await handleEditSave();
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-3 mt-4" style={{ color: "#000" }}>
      <h6 className="fw-bold mb-3">
        {isAddMovie ? "Add New Movie" : "Update Movie"}
      </h6>

      {editError && (
        <div
          className="alert alert-danger py-2"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {editError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Movie ID */}
        <div className="mb-3">
          <label className="form-label">
            Movie ID <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="movie_id"
            value={editForm?.movie_id || ""}
            onChange={handleEditChange}
            disabled={!isAddMovie}
            required
          />
          {!isAddMovie && (
            <small className="text-muted">Movie ID cannot be changed</small>
          )}
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">
            Title <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="title"
            value={editForm?.title || ""}
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
            value={editForm?.original_title || ""}
            onChange={handleEditChange}
          />
        </div>

        {/* Original Language */}
        <div className="mb-3">
          <label className="form-label">Original Language</label>
          <input
            className="form-control"
            name="original_language"
            value={editForm?.original_language || ""}
            onChange={handleEditChange}
            placeholder="e.g., en, vi, ja"
            maxLength={10}
          />
          <small className="text-muted">2-10 characters language code</small>
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">
            Duration (minutes) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="duration"
            value={editForm?.duration || ""}
            onChange={handleEditChange}
            min="1"
            max="600"
            required
          />
        </div>

        {/* Poster Path */}
        <div className="mb-3">
          <label className="form-label">
            Poster Path <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="poster_path"
            value={editForm?.poster_path || ""}
            onChange={handleEditChange}
            placeholder="/path/to/poster.jpg or http://..."
            required
          />
          <small className="text-muted">Must start with / or http</small>
        </div>

        {/* Backdrop Path */}
        <div className="mb-3">
          <label className="form-label">Backdrop Path</label>
          <input
            className="form-control"
            name="backdrop_path"
            value={editForm?.backdrop_path || ""}
            onChange={handleEditChange}
            placeholder="/path/to/backdrop.jpg or http://..."
          />
        </div>

        {/* Trailer */}
        <div className="mb-3">
          <label className="form-label">Trailer Link</label>
          <input
            type="url"
            className="form-control"
            name="trailer_link"
            value={editForm?.trailer_link || ""}
            onChange={handleEditChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Vote Average */}
        <div className="mb-3">
          <label className="form-label">Vote Average</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            name="vote_average"
            value={editForm?.vote_average || ""}
            onChange={handleEditChange}
            min="0"
            max="10"
            placeholder="0.0 - 10.0"
          />
        </div>

        {/* Genres */}
        <div className="mb-3">
          <label className="form-label">
            Genres <span className="text-muted">(Select multiple)</span>
          </label>
          <div
            className="border rounded p-3"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {genresList.length > 0 ? (
              <div className="row">
                {genresList.map((genre) => (
                  <div key={genre.genre_id} className="col-md-4 mb-2">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`genre-${genre.genre_id}`}
                        checked={normalizedGenres.includes(genre.genre_id)}
                        onChange={() => handleGenreToggle(genre.genre_id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`genre-${genre.genre_id}`}
                      >
                        {genre.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">Loading genres...</p>
            )}
          </div>
          <small className="text-muted">
            Selected: {normalizedGenres.length} genre(s)
          </small>
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
            value={editForm?.overview || ""}
            onChange={handleEditChange}
            maxLength={2000}
            required
          />
          <small className="text-muted">
            {editForm?.overview ? editForm.overview.length : 0} / 2000
            characters
          </small>
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
              editForm?.release_date ? editForm.release_date.slice(0, 10) : ""
            }
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={isAddMovie ? handleAddCancel : handleEditCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
