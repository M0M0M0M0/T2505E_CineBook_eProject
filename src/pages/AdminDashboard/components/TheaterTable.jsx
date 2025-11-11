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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (theatersProp && theatersProp.length > 0) {
      setTheaters(theatersProp);
      extractCities(theatersProp);
      return;
    }
    fetch("http://127.0.0.1:8000/api/theaters")
      .then((res) => res.json())
      .then((data) => {
        setTheaters(data);
        extractCities(data);
      })
      .catch(() => setTheaters([]));
  }, [theatersProp]);

  // Extract unique cities for dropdown
  const extractCities = (data) => {
    const uniqueCities = [...new Set(data.map((t) => t.city || t.theater_city))].filter(
      (city) => city
    );
    setCities(uniqueCities);
  };

  // Apply search + city filter
  const filteredTheaters = theaters.filter(
    (theater) =>
      (theater.name || theater.theater_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedCity === "" || (theater.city || theater.theater_city) === selectedCity)
  );

  return (
    <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: 500 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key="theater-table"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
  {/* Left side: Search + Filter */}
  <div className="d-flex gap-2">
    {/* Search input */}
    <input
      type="text"
      className="form-control"
      style={{ minWidth: 200 }}
      placeholder="Search theaters..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* City filter dropdown */}
    <select
      className="form-select"
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
    >
      <option value="">All Cities</option>
      {cities.map((city, idx) => (
        <option key={idx} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  {/* Right side: Add Theater button */}
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
              {filteredTheaters.map((theater, idx) => (
                <tr key={theater.id || idx}>
                  <td className="fw-semibold">{theater.name || theater.theater_name}</td>
                  <td>{theater.city || theater.theater_city}</td>
                  <td>{theater.address || theater.theater_address}</td>
                  <td>{theater.rooms || theater.theater_rooms}</td>
                  <td>{theater.seatCapacity || theater.theater_capacity}</td>
                  <td>
                    <span className={`badge bg-${theater.statusColor || "success"}`}>
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
