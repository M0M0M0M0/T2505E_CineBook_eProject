import React, { useState, useMemo } from "react";
import { Film, Pencil, X as XIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovieTable({
  movies,
  handleEdit,
  handleAddMovie,
  movieSearch,
  setMovieSearch,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [durationFrom, setDurationFrom] = useState("");
  const [durationTo, setDurationTo] = useState("");
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const genreOptions = useMemo(() => {
    const genresSet = new Set();
    movies.forEach((m) => {
      if (Array.isArray(m.genres)) {
        m.genres.forEach((g) => genresSet.add(g.name));
      }
    });
    return Array.from(genresSet);
  }, [movies]);

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title
      ?.toLowerCase()
      .includes(movieSearch.toLowerCase());

    const matchesGenre =
      selectedGenres.length > 0
        ? Array.isArray(movie.genres) &&
        movie.genres.some((g) => selectedGenres.includes(g.name))
        : true;

    const duration = Number(movie.duration) || 0;
    const matchesDuration =
      (!durationFrom || duration >= Number(durationFrom)) &&
      (!durationTo || duration <= Number(durationTo));

    const release = movie.release_date ? movie.release_date.slice(0, 10) : "";
    const matchesRelease =
      (!releaseFrom || release >= releaseFrom) &&
      (!releaseTo || release <= releaseTo);

    return matchesTitle && matchesGenre && matchesDuration && matchesRelease;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDurationInput = (value, setter) => {
    if (/^\d*$/.test(value)) setter(value);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
    setCurrentPage(1);
  };

  return (
    <div
      className="rounded shadow-sm p-4"
      style={{ minHeight: 500, backgroundColor: "#fdfdfd" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="movie-table"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Row 1: Search + Genre */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
            {/* Left side: Search + Genre */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <input
                type="text"
                className="form-control"
                style={{
                  width: "200px",
                  backgroundColor: "#f8f9fa",
                  color: "#212529",
                }}
                placeholder="Search by title..."
                value={movieSearch}
                onChange={(e) => {
                  setMovieSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />

              {/* Dropdown Genre */}
              <div
                className="position-relative"
                onMouseEnter={() => setGenreDropdownOpen(true)}
                onMouseLeave={() => setGenreDropdownOpen(false)}
              >
                <button className="btn btn-outline-secondary d-flex align-items-center">
                  Genre <ChevronDown size={16} className="ms-1" />
                </button>

                {genreDropdownOpen && (
                  <div
                    className="position-absolute border rounded shadow-sm p-3 mt-1"
                    style={{
                      zIndex: 100,
                      minWidth: 250,
                      backgroundColor: "#f8f9fa",
                      color: "#212529",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "6px 12px", // khoảng cách hàng & cột
                    }}
                  >
                    {genreOptions.map((g) => (
                      <div key={g} className="form-check" style={{ margin: 0 }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`genre-${g}`}
                          checked={selectedGenres.includes(g)}
                          onChange={() => toggleGenre(g)}
                        />
                        <label className="form-check-label ms-1" htmlFor={`genre-${g}`}>
                          {g}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Add Movie button */}
            <button className="btn btn-primary" onClick={handleAddMovie}>
              <Film size={16} className="me-2" /> Add Movie
            </button>
          </div>

          {/* Row 2: Duration + Release filters */}
          <div className="d-flex flex-wrap gap-3 mb-3 align-items-center text-dark">
            {/* Duration */}
            <div className="d-flex align-items-center gap-2">
              <span className="fw-medium">Duration:</span>
              <span>from</span>
              <input
                type="text"
                className="form-control"
                style={{
                  width: 80,
                  backgroundColor: "#f8f9fa",
                  color: "#212529",
                }}
                placeholder="min"
                value={durationFrom}
                onChange={(e) =>
                  handleDurationInput(e.target.value, setDurationFrom)
                }
              />
              <span>to</span>
              <input
                type="text"
                className="form-control"
                style={{
                  width: 80,
                  backgroundColor: "#f8f9fa",
                  color: "#212529",
                }}
                placeholder="max"
                value={durationTo}
                onChange={(e) =>
                  handleDurationInput(e.target.value, setDurationTo)
                }
              />

            </div>

            {/* Release */}
            <div className="d-flex align-items-center gap-2">
              <span className="fw-medium">Release:</span>
              <span>from</span>
              <input
                type="date"
                className="form-control"
                style={{
                  width: 150,
                  backgroundColor: "#f8f9fa",
                  color: "#212529",
                }}
                value={releaseFrom}
                onChange={(e) => setReleaseFrom(e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                className="form-control"
                style={{
                  width: 150,
                  backgroundColor: "#f8f9fa",
                  color: "#212529",
                }}
                value={releaseTo}
                onChange={(e) => setReleaseTo(e.target.value)}
              />
            </div>
          </div>

          {/* Movie table */}
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Release Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMovies.length > 0 ? (
                currentMovies.map((movie, idx) => (
                  <tr key={idx}>
                    <td style={{ width: 80 }}>
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="rounded"
                        width="48"
                        height="72"
                        style={{
                          objectFit: "cover",
                          backgroundColor: "#eee",
                        }}
                      />
                    </td>
                    <td className="fw-semibold">{movie.title}</td>
                    <td>
                      {Array.isArray(movie.genres)
                        ? movie.genres.map((g) => g.name).join(", ")
                        : movie.genres || "N/A"}
                    </td>
                    <td>{movie.duration || "—"}</td>
                    <td>
                      {movie.release_date
                        ? movie.release_date.slice(0, 10)
                        : "Unknown"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-light me-1"
                        title="Edit"
                        onClick={() => handleEdit(movie, idx)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-sm btn-light" title="Delete">
                        <XIcon size={16} color="#dc3545" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No movies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
