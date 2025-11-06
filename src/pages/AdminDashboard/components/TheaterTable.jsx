import React, { useEffect, useState } from "react";
import { Pencil, Building2, X as XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TheaterTable({
  theaters: theatersProp,
  handleEditTheater,
  handleManageRooms,
  handleAddTheater,
}) {
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    // Nếu có theaters từ prop thì dùng, nếu không thì fetch từ API
    if (theatersProp && theatersProp.length > 0) {
      setTheaters(theatersProp);
      return;
    }
    fetch("http://127.0.0.1:8000/api/theaters")
      .then((res) => res.json())
      .then((data) => setTheaters(data))
      .catch(() => setTheaters([]));
  }, [theatersProp]);

  return (
    <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: 500 }}>
      <AnimatePresence mode="wait">
        {/* Bảng danh sách rạp */}
        <motion.div
          key="theater-table"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search theaters..."
            />
            <button className="btn btn-primary" onClick={handleAddTheater}>
              <Building2 size={16} className="me-2" />
              Add Theater
            </button>
          </div>

          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Rooms</th>
                <th>Seat Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((theater, idx) => (
                <tr key={theater.id || idx}>
                  <td className="fw-semibold">
                    {theater.name || theater.theater_name}
                  </td>
                  <td>{theater.city || theater.theater_city}</td>
                  <td>{theater.address || theater.theater_address}</td>
                  <td>{theater.rooms || theater.theater_rooms}</td>
                  <td>{theater.seatCapacity || theater.theater_capacity}</td>
                  <td>
                    <span
                      className={`badge bg-${theater.statusColor || "success"}`}
                    >
                      {theater.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-light me-1"
                      title="Edit Theater Info"
                      onClick={() => handleEditTheater(theater, idx)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-light me-1"
                      title="Manage Rooms & Seats"
                      onClick={() => handleManageRooms(theater)}
                    >
                      <Building2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-light"
                      title="Delete"
                      onClick={() => console.log("Delete theater", idx)}
                    >
                      <XIcon size={16} color="#dc3545" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
