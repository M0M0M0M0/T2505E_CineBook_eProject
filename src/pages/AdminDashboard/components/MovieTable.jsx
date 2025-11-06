import React from "react";
import { Film, Pencil, Eye, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovieTable({ movies, handleEdit, handleAddMovie }) {
  return (
    <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: 500 }}>
      <AnimatePresence mode="wait">
        {/* Bảng danh sách phim */}
        <motion.div
          key="movie-table"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} // Bỏ transition trong animate
          exit={{ opacity: 0, y: -20 }} // Bỏ transition trong exit
          transition={{ duration: 0.2 }} // Chỉ để 1 transition chung
        >
          {/* Thanh tìm kiếm */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search"
            />
            <button className="btn btn-primary" onClick={handleAddMovie}>
              <Film size={16} className="me-2" />
              Add Movie
            </button>
          </div>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Release Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, idx) => (
                <tr key={idx}>
                  <td style={{ width: 80 }}>
                    <div style={{ width: 48, height: 72 }}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="rounded"
                        width="48"
                        height="72"
                        style={{
                          objectFit: "cover",
                          backgroundColor: "#eee", // Thêm background mặc định
                        }}
                      />
                    </div>
                  </td>
                  <td className="fw-semibold">{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.duration}</td>
                  <td>{movie.release}</td>
                  <td>
                    <span className={`badge bg-${movie.statusColor}`}>
                      {movie.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-light me-1"
                      title="Edit"
                      onClick={() => handleEdit(movie, idx)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-light me-1"
                      title="View Detail"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="btn btn-sm btn-light" title="Delete">
                      <XIcon size={16} color="#dc3545" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Phân trang */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>Page 1 of 1</span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
