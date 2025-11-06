import React from "react";

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
  return (
    <div className="border rounded p-3 mt-4">
      <h6 className="fw-bold mb-3">
        {isAddMovie ? "Thêm phim mới" : "Chỉnh sửa phim"}
      </h6>
      {editError && <div className="alert alert-danger py-2">{editError}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          isAddMovie ? handleAddSave() : handleEditSave();
        }}
      >
        <div className="mb-3">
          <label className="form-label">
            Movie ID <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="movieId"
            value={editForm.movieId}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Title <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Poster Path <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="poster"
            value={editForm.poster}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Genre <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="genre"
            value={editForm.genre}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Duration <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="duration"
            value={editForm.duration}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Trailer Link <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="trailer"
            value={editForm.trailer}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Overview <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="overview"
            value={editForm.overview}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Original Language</label>
          <input
            className="form-control"
            name="originalLanguage"
            value={editForm.originalLanguage}
            onChange={handleEditChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Original Title</label>
          <input
            className="form-control"
            name="originalTitle"
            value={editForm.originalTitle}
            onChange={handleEditChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Release Date <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            name="release"
            value={editForm.release}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Lưu
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={isAddMovie ? handleAddCancel : handleEditCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
