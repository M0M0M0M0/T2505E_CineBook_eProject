import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart as RelineChart, Line, PieChart, Pie, Cell } from "recharts";
import {
  User,
  Film,
  DollarSign,
  LayoutDashboard,
  Users,
  Settings,
  LineChart as LineChartIcon,
  Pencil,
  Eye,
  X as XIcon,
  Building,
  Building2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { demoMovies } from "./pricingData";

export default function Dashboard() {
  const salesData = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 500 },
    { name: "Thu", value: 700 },
    { name: "Fri", value: 600 },
    { name: "Sat", value: 800 },
    { name: "Sun", value: 550 },
  ];

  const revenueData = [
    { name: "Feb", revenue: 12000 },
    { name: "Mar", revenue: 17000 },
    { name: "Apr", revenue: 15000 },
    { name: "May", revenue: 20000 },
    { name: "Jun", revenue: 22000 },
  ];

  const topMovies = [
    { name: "Iron Man", value: 400 },
    { name: "Avatar", value: 300 },
    { name: "Black Widow", value: 300 },
  ];

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D"];

  // State lưu mục menu đang chọn
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Menu items không lưu trạng thái active cứng
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Movies", icon: <Film size={18} /> },
    { name: "Theaters", icon: <Building size={18} /> }, // Thêm menu item này
    { name: "Showtimes", icon: <Users size={18} /> },
    { name: "Pricing", icon: <LineChartIcon size={18} /> },
    { name: "Users", icon: <Settings size={18} /> },
  ];

  // Pricing data

  const [pricingMovies, pricingSetMovies] = React.useState(demoMovies);
  const [pricingSettings, pricingSetSettings] = React.useState({
    weekday: -5,
    weekend: 10,
    normal: -5,
    peak: 15,
    seats: { gold: 10, platinum: 20, box: 40 },
  });
  const [pricingEditCommon, pricingSetEditCommon] = useState(false);
  const [pricingEditSeats, pricingSetEditSeats] = useState(false);

  // dữ liệu danh sách user
  const [usersList, usersSetList] = useState([]);
  const [userSearch, userSetSearch] = useState("");
  const [userFilterStatus, userSetFilterStatus] = useState("all");
  const [userSelected, userSetSelected] = useState(null);
  const [userEditing, userSetEditing] = useState(false);
  const [userExporting, userSetExporting] = useState(false);
  const [userChangingPassword, userSetChangingPassword] = useState(false);

  // Dữ liệu mẫu cho phim
  const movies = [
    {
      poster: "https://via.placeholder.com/60x90?text=Poster",
      title: "THE REAL GHOST",
      genre: "Horror",
      duration: "120 min",
      release: "20 Jul 2024",
      status: "Coming Soon",
      statusColor: "warning",
    },
    {
      poster: "https://via.placeholder.com/60x90?text=Poster",
      title: "BLACK WIDOW",
      genre: "Action",
      duration: "135 min",
      release: "10 Jun 2024",
      status: "Now Showing",
      statusColor: "success",
    },
    {
      poster: "https://via.placeholder.com/60x90?text=Poster",
      title: "AVATAR",
      genre: "Sci-Fi",
      duration: "150 min",
      release: "01 May 2024",
      status: "Ended",
      statusColor: "secondary",
    },
    {
      poster: "https://via.placeholder.com/60x90?text=Poster",
      title: "SPIDER-MAN",
      genre: "Adventure",
      duration: "110 min",
      release: "05 Jul 2024",
      status: "Now Showing",
      statusColor: "success",
    },
    {
      poster: "https://via.placeholder.com/60x90?text=Poster",
      title: "BARBIE",
      genre: "Comedy",
      duration: "95 min",
      release: "30 Jul 2024",
      status: "Coming Soon",
      statusColor: "warning",
    },
  ];

  // State cho edit movie
  const [editMovie, setEditMovie] = useState(null);
  const [editForm, setEditForm] = useState({
    movieId: "",
    title: "",
    poster: "",
    genre: "",
    duration: "",
    trailer: "",
    overview: "",
    originalLanguage: "",
    originalTitle: "",
    release: "",
  });
  const [editError, setEditError] = useState("");

  // State cho add movie
  const [isAddMovie, setIsAddMovie] = useState(false);

  // Thêm dữ liệu mẫu cho theaters
  const theaters = [
    {
      name: "CGV Aeon Mall",
      city: "Ho Chi Minh",
      address: "30 Bo Bao Tan Thang, Son Ky Ward, Tan Phu District",
      rooms: 5,
      seatCapacity: 800,
      status: "Active",
      statusColor: "success",
    },
    {
      name: "Galaxy Nguyen Du",
      city: "Ho Chi Minh",
      address: "116 Nguyen Du, Ben Thanh Ward, District 1",
      rooms: 4,
      seatCapacity: 600,
      status: "Active",
      statusColor: "success",
    },
    // Thêm theaters khác...
  ];

  // Dữ liệu mẫu
  const cities = ["Hà Nội", "TP. Hồ Chí Minh"];
  const theaters2 = [
    { id: 1, name: "CGV Vincom", city: "Hà Nội" },
    { id: 2, name: "BHD Bitexco", city: "TP. Hồ Chí Minh" },
  ];
  const movies2 = [
    { id: 1, title: "Avengers: Endgame" },
    { id: 2, title: "Inception" },
  ];
  const showtimes = [
    {
      title: "Avengers: Endgame",
      city: "Hà Nội",
      theater: "CGV Vincom",
      date: "2025-10-18",
      time: "18:30",
      room: 3,
      price: 120000,
      status: "Available",
      statusColor: "success",
      sold: 45,
      totalTicket: 100,
    },
    {
      title: "Inception",
      city: "TP. Hồ Chí Minh",
      theater: "BHD Bitexco",
      date: "2025-10-19",
      time: "20:00",
      room: 2,
      price: 100000,
      status: "Full",
      statusColor: "danger",
      sold: 100,
      totalTicket: 100,
    },
  ];

  // State
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [selectedShowtimeData, setSelectedShowtimeData] = useState(null);

  // Xử lý khi nhấn Select
  const handleSelectShowtime = () => {
    const filtered = showtimes.filter((s) => {
      const matchCity = selectedCity ? s.city === selectedCity : true;
      const matchTheater = selectedTheater
        ? s.theater === selectedTheater
        : true;
      const matchMovie = selectedMovie ? s.title === selectedMovie : true;
      return matchCity && matchTheater && matchMovie;
    });

    setFilteredShowtimes(filtered);
  };

  // State cho theater
  const [editTheater, setEditTheater] = useState(null);
  const [isAddTheater, setIsAddTheater] = useState(false);
  const [theaterForm, setTheaterForm] = useState({
    name: "",
    city: "",
    address: "",
    rooms: "",
    seatCapacity: "",
  });
  const [theaterError, setTheaterError] = useState("");

  // --- Room & Seat Management ---
const [showManageRooms, setShowManageRooms] = useState(false);
const [selectedTheaterForRooms, setSelectedTheaterForRooms] = useState(null);

const [rooms, setRooms] = useState([]);
const [newRoom, setNewRoom] = useState({ room_name: "", room_type: "" });

const [selectedRoom, setSelectedRoom] = useState(null);
const [seats, setSeats] = useState([]);
const [newSeat, setNewSeat] = useState({
  seat_row: "",
  seat_number: "",
  seat_type_id: "",
});


  const handleMenuClick = (name) => {
    if (name === activeMenu) return;
    setActiveMenu(name);
    setEditMovie(null);
    setIsAddMovie(false);
    setEditError("");
  };

  const handleEdit = (movie, idx) => {
    setEditMovie(idx);
    setIsAddMovie(false);
    setEditForm({
      movieId: idx + 1 + "",
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre,
      duration: movie.duration,
      trailer: movie.trailer || "",
      overview: movie.overview || "",
      originalLanguage: movie.originalLanguage || "",
      originalTitle: movie.originalTitle || "",
      release: movie.release,
    });
    setEditError("");
  };

  const handleAddMovie = () => {
    setIsAddMovie(true);
    setEditMovie(null);
    setEditForm({
      movieId: "",
      title: "",
      poster: "",
      genre: "",
      duration: "",
      trailer: "",
      overview: "",
      originalLanguage: "",
      originalTitle: "",
      release: "",
    });
    setEditError("");
  };

  // Khi nhấn Save
  const handleEditSave = () => {
    // Validate 8 trường bắt buộc
    const required = [
      "movieId",
      "title",
      "poster",
      "genre",
      "duration",
      "trailer",
      "overview",
      "release",
    ];
    for (let key of required) {
      if (!editForm[key] || editForm[key].trim() === "") {
        setEditError("Please fill all required fields.");
        return;
      }
    }
    // Lưu lại (ở đây chỉ đóng form, thực tế sẽ cập nhật state)
    setEditMovie(null);
    setEditError("");
    // Có thể cập nhật movies ở đây nếu muốn
  };

  // Khi nhấn Save ở form Add
  const handleAddSave = () => {
    const required = [
      "movieId",
      "title",
      "poster",
      "genre",
      "duration",
      "trailer",
      "overview",
      "release",
    ];
    for (let key of required) {
      if (!editForm[key] || editForm[key].trim() === "") {
        setEditError("Please fill all required fields.");
        return;
      }
    }
    // Thực tế: thêm vào danh sách movies ở đây nếu muốn
    setIsAddMovie(false);
    setEditError("");
  };

  // Khi nhấn Cancel
  const handleEditCancel = () => {
    setEditMovie(null);
    setEditError("");
  };

  // Khi nhấn Cancel ở form Add
  const handleAddCancel = () => {
    setIsAddMovie(false);
    setEditError("");
  };

  // Khi thay đổi input
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handlers cho theater
const handleAddTheater = () => {
  setIsAddTheater(true);
  setEditTheater(null);
  setTheaterForm({
    theater_name: "",
    theater_city: "",
    theater_address: "",
    theater_capacity: "",
  });
  setTheaterError("");
};

// ---- ROOM HANDLERS ----
const handleManageRooms = (theater) => {
  setSelectedTheaterForRooms(theater);
  setShowManageRooms(true);
  setRooms([]); // Later can load from backend
};

const handleAddRoom = () => {
  if (!newRoom.room_name || !newRoom.room_type) return;
  const roomData = { ...newRoom, seats: [] };
  setRooms([...rooms, roomData]);
  setNewRoom({ room_name: "", room_type: "" });
};

const handleDeleteRoom = (index) => {
  setRooms(rooms.filter((_, i) => i !== index));
};

const handleViewSeats = (room) => {
  setSelectedRoom(room);
  setSeats(room.seats || []);
};

// ---- SEAT HANDLERS ----
const handleAddSeat = () => {
  if (!newSeat.seat_row || !newSeat.seat_number || !newSeat.seat_type_id) return;
  const seatData = { ...newSeat };
  setSeats([...seats, seatData]);
  setNewSeat({ seat_row: "", seat_number: "", seat_type_id: "" });
};

const handleDeleteSeat = (index) => {
  setSeats(seats.filter((_, i) => i !== index));
};


const handleEditTheater = (theater, idx) => {
  setEditTheater(idx);
  setIsAddTheater(false);
  setTheaterForm({
    theater_name: theater.theater_name,
    theater_city: theater.theater_city,
    theater_address: theater.theater_address,
    theater_capacity: theater.theater_capacity,
  });
  setTheaterError("");
};

const handleTheaterChange = (e) => {
  setTheaterForm({ ...theaterForm, [e.target.name]: e.target.value });
};

const handleTheaterSave = () => {
  const required = ["theater_name", "theater_city", "theater_address", "theater_capacity"];
  for (let key of required) {
    if (!theaterForm[key] || theaterForm[key].toString().trim() === "") {
      setTheaterError("Please fill all required fields.");
      return;
    }
  }
  setEditTheater(null);
  setTheaterError("");
  // Add your API call or save logic here (PUT request to backend)
};

const handleAddTheaterSave = () => {
  const required = ["theater_name", "theater_city", "theater_address", "theater_capacity"];
  for (let key of required) {
    if (!theaterForm[key] || theaterForm[key].toString().trim() === "") {
      setTheaterError("Please fill all required fields.");
      return;
    }
  }

  // Example API POST to Laravel backend
  fetch("http://localhost:8000/api/theaters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(theaterForm),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Theater added:", data);
      setIsAddTheater(false);
      setTheaterError("");
    })
    .catch((err) => {
      console.error("Error adding theater:", err);
      setTheaterError("Failed to save theater.");
    });
};


  return (
    <div className="d-flex bg-light">
      {/* Sidebar */}
      <aside className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <h2 className="fw-bold text-danger mb-4">CineBook</h2>
        <nav className="d-flex flex-column gap-2">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className={`d-flex align-items-center gap-2 p-2 rounded cursor-pointer ${
                activeMenu === item.name
                  ? "bg-danger text-white"
                  : "text-secondary hover-bg-light"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        {/* Header */}

        {/* Nội dung thay đổi theo menu */}
        {activeMenu === "Dashboard" && (
          <>
            {/* Stats Cards */}
            <h1 className="fw-bold fs-3 text-dark">🎬 Dashboard</h1>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="text-danger d-flex align-items-center gap-2">
                      <Film /> Total Bookings
                    </h5>
                    <h3 className="fw-semibold mt-2">2,345</h3>
                    <p className="text-success small">+4.5% from last week</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="text-primary d-flex align-items-center gap-2">
                      <User /> User Registrations
                    </h5>
                    <h3 className="fw-semibold mt-2">1,230</h3>
                    <p className="text-success small">+3.2% from last week</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="text-pink d-flex align-items-center gap-2">
                      <DollarSign /> Today's Bookings
                    </h5>
                    <h3 className="fw-semibold mt-2">234</h3>
                    <p className="text-success small">+1.5% today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Sales Details</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <RelineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#FF6B6B"
                          strokeWidth={3}
                        />
                      </RelineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Total Revenue</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="revenue"
                          fill="#4ECDC4"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Top & Upcoming Movies */}
            <div className="row g-4 mt-4">
              <div className="col-lg-6">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Top Selling Movies</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={topMovies}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {topMovies.map((_, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Upcoming Movies</h5>
                    <ul className="list-unstyled mt-3">
                      <li className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src="https://via.placeholder.com/60"
                          alt="movie"
                          className="rounded"
                        />
                        <div>
                          <p className="fw-semibold mb-0">The Real Ghost</p>
                          <p className="text-muted small mb-0">
                            Release: Oct 30
                          </p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center gap-3">
                        <img
                          src="https://via.placeholder.com/60"
                          alt="movie"
                          className="rounded"
                        />
                        <div>
                          <p className="fw-semibold mb-0">Black Widow</p>
                          <p className="text-muted small mb-0">
                            Release: Nov 15
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeMenu === "Movies" && (
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{ minHeight: 500 }}
          >
            <AnimatePresence mode="wait">
              {/* Bảng danh sách phim */}
              {editMovie === null && !isAddMovie && (
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
                    <button
                      className="btn btn-primary"
                      onClick={handleAddMovie}
                    >
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
                            <button
                              className="btn btn-sm btn-light"
                              title="Delete"
                            >
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
              )}
              {/* Form chỉnh sửa hoặc thêm phim */}
              {(editMovie !== null || isAddMovie) && (
                <motion.div
                  key="movie-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ maxWidth: 600, margin: "0 auto" }}
                >
                  <h4 className="mb-3">
                    {isAddMovie ? "Add Movie" : "Edit Movie"}
                  </h4>
                  {editError && (
                    <div className="alert alert-danger py-2">{editError}</div>
                  )}
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
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={
                          isAddMovie ? handleAddCancel : handleEditCancel
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeMenu === "Theaters" && (
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{ minHeight: 500 }}
          >
            <AnimatePresence mode="wait">
              {/* Bảng danh sách rạp */}
              {editTheater === null && !isAddTheater && (
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
                    <button
                      className="btn btn-primary"
                      onClick={handleAddTheater}
                    >
                      <Building size={16} className="me-2" />
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
                        <tr key={idx}>
                          <td className="fw-semibold">{theater.name}</td>
                          <td>{theater.city}</td>
                          <td>{theater.address}</td>
                          <td>{theater.rooms}</td>
                          <td>{theater.seatCapacity}</td>
                          <td>
                            <span className={`badge bg-${theater.statusColor}`}>
                              {theater.status}
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
              )}

             {/* Form thêm/sửa rạp */}
{(editTheater !== null || isAddTheater) && (
  <motion.div
    key="theater-form"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    style={{ maxWidth: 600, margin: "0 auto" }}
    className="card shadow-sm border-0 p-4"
  >
    <h4 className="mb-4 text-center text-primary fw-semibold">
      {isAddTheater ? "🎬 Add Theater" : "✏️ Edit Theater"}
    </h4>

    {theaterError && (
      <div className="alert alert-danger py-2">{theaterError}</div>
    )}

    <form
      onSubmit={(e) => {
        e.preventDefault();
        isAddTheater ? handleAddTheaterSave() : handleTheaterSave();
      }}
    >
      <div className="mb-3">
        <label className="form-label fw-semibold">
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
        <label className="form-label">
          City <span className="text-danger">*</span>
        </label>
        <select
          className="form-control"
          name="city"
          value={theaterForm.city}
          onChange={handleTheaterChange}
          required
        >
          <option value="">Select a city</option>
          <option value="Ha Noi">Ha Noi</option>
          <option value="Ho Chi Minh">Ho Chi Minh</option>
          <option value="Da Nang">Da Nang</option>
        </select>
      </div>



      <div className="mb-3">
        <label className="form-label fw-semibold">
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
        <button type="submit" className="btn btn-primary">
          💾 Save
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setEditTheater(null);
            setIsAddTheater(false);
          }}
        >
          ✖ Cancel
        </button>
      </div>
    </form>
  </motion.div>
)}

        {/* Manage Rooms and Seats */}
{showManageRooms && selectedTheaterForRooms && (
  <motion.div
    key="manage-rooms"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className="card shadow-sm border-0 p-4"
    style={{ maxWidth: 900, margin: "0 auto" }}
  >
    <h4 className="mb-4 text-center text-info fw-semibold">
      🏢 Manage Rooms – {selectedTheaterForRooms.theater_name}
    </h4>

    {/* Add Room Form */}
    <form
      className="d-flex gap-2 align-items-end mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddRoom();
      }}
    >
      <div className="flex-grow-1">
        <label className="form-label fw-semibold">Room Name</label>
        <input
          className="form-control"
          placeholder="Enter room name"
          value={newRoom.room_name}
          onChange={(e) =>
            setNewRoom({ ...newRoom, room_name: e.target.value })
          }
          required
        />
      </div>
      <div className="flex-grow-1">
        <label className="form-label fw-semibold">Room Type</label>
        <select
          className="form-control"
          value={newRoom.room_type}
          onChange={(e) =>
            setNewRoom({ ...newRoom, room_type: e.target.value })
          }
          required
        >
          <option value="">Select type</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="VIP">VIP</option>
        </select>
      </div>
      <button type="submit" className="btn btn-success">
        ➕ Add Room
      </button>
    </form>

    {/* Room Table */}
    <table className="table table-hover align-middle">
      <thead className="table-light">
        <tr>
          <th>Room Name</th>
          <th>Type</th>
          <th>Seats</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rooms.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center text-muted">
              No rooms yet.
            </td>
          </tr>
        ) : (
          rooms.map((room, index) => (
            <tr key={index}>
              <td>{room.room_name}</td>
              <td>{room.room_type}</td>
              <td>{room.seats?.length || 0}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => handleViewSeats(room)}
                >
                  View Seats
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteRoom(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* Seat Management */}
    {selectedRoom && (
      <div className="mt-5">
        <h5 className="fw-semibold text-primary mb-3">
          🎟 Manage Seats – {selectedRoom.room_name}
        </h5>

        <form
          className="d-flex gap-2 align-items-end mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSeat();
          }}
        >
          <div>
            <label className="form-label">Row</label>
            <input
              className="form-control"
              placeholder="A"
              maxLength={1}
              value={newSeat.seat_row}
              onChange={(e) =>
                setNewSeat({ ...newSeat, seat_row: e.target.value.toUpperCase() })
              }
              required
            />
          </div>
          <div>
            <label className="form-label">Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="1"
              value={newSeat.seat_number}
              onChange={(e) =>
                setNewSeat({ ...newSeat, seat_number: e.target.value })
              }
              required
            />
          </div>
          <div className="flex-grow-1">
            <label className="form-label">Seat Type</label>
            <select
              className="form-control"
              value={newSeat.seat_type_id}
              onChange={(e) =>
                setNewSeat({ ...newSeat, seat_type_id: e.target.value })
              }
              required
            >
              <option value="">Select type</option>
              <option value="STD">Standard</option>
              <option value="VIP">VIP</option>
              <option value="DLX">Deluxe</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            ➕ Add Seat
          </button>
        </form>

        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Row</th>
              <th>Number</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seats.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No seats yet.
                </td>
              </tr>
            ) : (
              seats.map((seat, index) => (
                <tr key={index}>
                  <td>{seat.seat_row}</td>
                  <td>{seat.seat_number}</td>
                  <td>{seat.seat_type_id}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteSeat(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}

    {/* Back */}
    <div className="d-flex justify-content-end mt-4">
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          setShowManageRooms(false);
          setSelectedTheaterForRooms(null);
          setSelectedRoom(null);
        }}
      >
        ✖ Back
      </button>
    </div>
  </motion.div>
)}


            </AnimatePresence>
          </div>
        )}

        {activeMenu === "Showtimes" && (
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{ minHeight: 500 }}
          >
            <AnimatePresence mode="wait">
              {selectedShowtimeData === null && (
                <motion.div
                  key="showtime-table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* --- Bộ lọc chọn City, Theater, Movie --- */}
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    {/* --- Nhóm 1: City + Theater + nút lọc --- */}
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <select
                        className="form-select w-auto"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cities.map((city, idx) => (
                          <option key={idx} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>

                      <select
                        className="form-select w-auto"
                        value={selectedTheater}
                        onChange={(e) => setSelectedTheater(e.target.value)}
                      >
                        <option value="">Select Theater</option>
                        {theaters2
                          .filter(
                            (t) => !selectedCity || t.city === selectedCity
                          )
                          .map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                      </select>

                      <button
                        className="btn btn-outline-primary"
                        onClick={handleSelectShowtime}
                        disabled={!selectedCity || !selectedTheater}
                      >
                        Filter Theater
                      </button>
                    </div>

                    {/* --- Nhóm 2: Movie + nút lọc --- */}
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <select
                        className="form-select w-auto"
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}
                      >
                        <option value="">Select Movie</option>
                        {movies2.map((m) => (
                          <option key={m.id} value={m.title}>
                            {m.title}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-primary"
                        onClick={handleSelectShowtime}
                        disabled={!selectedMovie}
                      >
                        Filter Movie
                      </button>
                    </div>
                  </div>

                  {/* --- Bảng danh sách showtime --- */}
                  {filteredShowtimes.length > 0 ? (
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Room</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Tickets</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShowtimes.map((s, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold">{s.title}</td>
                            <td>{s.date}</td>
                            <td>{s.time}</td>
                            <td>{s.room}</td>
                            <td>${s.price}</td>
                            <td>
                              <span className={`badge bg-${s.statusColor}`}>
                                {s.status}
                              </span>
                            </td>
                            <td>
                              {s.sold}/{s.totalTicket}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-light me-1"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-light me-1"
                                title="View Detail"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-light"
                                title="Delete"
                              >
                                <XIcon size={16} color="#dc3545" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted mt-4">
                      No showtimes available for the selected options.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeMenu === "Pricing" && (
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{ minHeight: 500 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="pricing-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* --- CÀI ĐẶT GIÁ CHUNG --- */}
                <div className="border rounded p-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Cài đặt giá áp dụng chung</h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => pricingSetEditCommon(!pricingEditCommon)}
                    >
                      {pricingEditCommon ? "Save" : "Edit"}
                    </button>
                  </div>

                  {!pricingEditCommon ? (
                    <table className="table table-bordered text-center mb-3">
                      <thead className="table-light">
                        <tr>
                          <th>Weekday</th>
                          <th>Weekend</th>
                          <th>Normal Hour</th>
                          <th>Peak Hour</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{pricingSettings.weekday}</td>
                          <td>{pricingSettings.weekend}</td>
                          <td>{pricingSettings.normal}</td>
                          <td>{pricingSettings.peak}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Weekday</label>
                        <input
                          type="number"
                          className="form-control"
                          value={pricingSettings.weekday}
                          onChange={(e) =>
                            pricingSetSettings({
                              ...pricingSettings,
                              weekday: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Weekend</label>
                        <input
                          type="number"
                          className="form-control"
                          value={pricingSettings.weekend}
                          onChange={(e) =>
                            pricingSetSettings({
                              ...pricingSettings,
                              weekend: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Normal Hour</label>
                        <input
                          type="number"
                          className="form-control"
                          value={pricingSettings.normal}
                          onChange={(e) =>
                            pricingSetSettings({
                              ...pricingSettings,
                              normal: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Peak Hour</label>
                        <input
                          type="number"
                          className="form-control"
                          value={pricingSettings.peak}
                          onChange={(e) =>
                            pricingSetSettings({
                              ...pricingSettings,
                              peak: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* GIÁ GHẾ */}
                  <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                    <h6 className="fw-bold mb-0">Giá ghế</h6>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => pricingSetEditSeats(!pricingEditSeats)}
                    >
                      {pricingEditSeats ? "Save" : "Edit"}
                    </button>
                  </div>

                  {!pricingEditSeats ? (
                    <table className="table table-bordered text-center">
                      <thead className="table-light">
                        <tr>
                          {Object.keys(pricingSettings.seats).map((seat) => (
                            <th key={seat} className="text-capitalize">
                              {seat}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {Object.keys(pricingSettings.seats).map((seat) => (
                            <td key={seat}>{pricingSettings.seats[seat]}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="row g-3">
                      {Object.keys(pricingSettings.seats).map((seat) => (
                        <div className="col-md-3" key={seat}>
                          <label className="form-label text-capitalize">
                            {seat}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={pricingSettings.seats[seat]}
                            onChange={(e) =>
                              pricingSetSettings({
                                ...pricingSettings,
                                seats: {
                                  ...pricingSettings.seats,
                                  [seat]: Number(e.target.value),
                                },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- CÀI ĐẶT GIÁ TỪNG PHIM --- */}
                <div className="border rounded p-3">
                  <h5 className="fw-bold mb-3">Cài đặt giá từng phim</h5>

                  {pricingMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="d-flex align-items-center justify-content-between mb-3"
                    >
                      <div className="flex-grow-1">
                        <label className="form-label mb-0 fw-semibold">
                          {movie.title}
                        </label>
                      </div>

                      {!movie.isEditing ? (
                        <>
                          <span className="me-3">{movie.basePrice}</span>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              pricingSetMovies(
                                pricingMovies.map((m) =>
                                  m.id === movie.id
                                    ? { ...m, isEditing: true }
                                    : m
                                )
                              )
                            }
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="number"
                            className="form-control w-auto me-2"
                            value={movie.basePrice}
                            onChange={(e) =>
                              pricingSetMovies(
                                pricingMovies.map((m) =>
                                  m.id === movie.id
                                    ? {
                                        ...m,
                                        basePrice: Number(e.target.value),
                                      }
                                    : m
                                )
                              )
                            }
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              pricingSetMovies(
                                pricingMovies.map((m) =>
                                  m.id === movie.id
                                    ? { ...m, isEditing: false }
                                    : m
                                )
                              )
                            }
                          >
                            Save
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {activeMenu === "Users" && (
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{ minHeight: 500 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="users-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* --- HEADER & TOOLBAR --- */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Quản lý người dùng</h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => userSetExporting(true)}
                    >
                      Xuất Excel
                    </button>
                  </div>
                </div>

                {/* --- SEARCH & FILTER --- */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: 300 }}
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={userSearch}
                    onChange={(e) => userSetSearch(e.target.value)}
                  />
                  <select
                    className="form-select w-auto"
                    value={userFilterStatus}
                    onChange={(e) => userSetFilterStatus(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="locked">Đã khóa</option>
                  </select>
                </div>

                  {/* --- BẢNG DANH SÁCH NGƯỜI DÙNG --- */}
                    <table className="table table-bordered align-middle text-center">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Họ tên</th>
                          <th>Email</th>
                          <th>Điện thoại</th>
                          <th>Địa chỉ</th>
                          <th>Ngày sinh</th>
                          <th>Ngày tạo</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList
                          .filter(
                            (u) =>
                              (userFilterStatus === "all" || u.status === userFilterStatus) &&
                              (u.full_name
                                .toLowerCase()
                                .includes(userSearch.toLowerCase()) ||
                                u.email.toLowerCase().includes(userSearch.toLowerCase()))
                          )
                          .map((u) => (
                            <tr key={u.web_user_id}>
                              <td>{u.web_user_id}</td>
                              <td>{u.full_name}</td>
                              <td>{u.email}</td>
                              <td>{u.phone_number}</td>
                              <td>{u.address}</td>
                              <td>{u.date_of_birth}</td>
                              <td>{new Date(u.created_at).toLocaleDateString("vi-VN")}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    u.status === "active" ? "bg-success" : "bg-secondary"
                                  }`}
                                >
                                  {u.status === "active" ? "Hoạt động" : "Đã khóa"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => userSetSelected(u)}
                                >
                                  Xem
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-warning me-2"
                                  onClick={() => {
                                    userSetSelected(u);
                                    userSetEditing(true);
                                  }}
                                >
                                  Sửa
                                </button>
                                <button
                                  className={`btn btn-sm ${
                                    u.status === "active"
                                      ? "btn-outline-danger"
                                      : "btn-outline-success"
                                  }`}
                                  onClick={() => {
                                    usersSetList(
                                      usersList.map((usr) =>
                                        usr.web_user_id === u.web_user_id
                                          ? {
                                              ...usr,
                                              status:
                                                usr.status === "active" ? "locked" : "active",
                                            }
                                          : usr
                                      )
                                    );
                                  }}
                                >
                                  {u.status === "active" ? "Khóa" : "Mở khóa"}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {/* --- CHI TIẾT NGƯỜI DÙNG --- */}
                    {userSelected && !userEditing && (
                      <div className="border rounded p-3 mt-4">
                        <h6 className="fw-bold mb-3">Chi tiết người dùng</h6>
                        <p><strong>ID:</strong> {userSelected.web_user_id}</p>
                        <p><strong>Họ tên:</strong> {userSelected.full_name}</p>
                        <p><strong>Email:</strong> {userSelected.email}</p>
                        <p><strong>Điện thoại:</strong> {userSelected.phone_number}</p>
                        <p><strong>Địa chỉ:</strong> {userSelected.address}</p>
                        <p><strong>Ngày sinh:</strong> {userSelected.date_of_birth}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(userSelected.created_at).toLocaleDateString("vi-VN")}</p>
                        <p><strong>Trạng thái:</strong> {userSelected.status}</p>

                        <div className="mt-3 d-flex gap-2">
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => userSetEditing(true)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => userSetSelected(null)}
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    )}


                {/* --- CHỈNH SỬA THÔNG TIN --- */}
                {userSelected && userEditing && (
                  <div className="border rounded p-3 mt-4">
                    <h6 className="fw-bold mb-3">
                      Chỉnh sửa thông tin người dùng
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Họ tên</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userSelected.fullname}
                          onChange={(e) =>
                            userSetSelected({
                              ...userSelected,
                              fullname: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={userSelected.email}
                          onChange={(e) =>
                            userSetSelected({
                              ...userSelected,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Điện thoại</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={userSelected.tel}
                          onChange={(e) =>
                            userSetSelected({
                              ...userSelected,
                              tel: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          userSetEditing(false);
                          userSetSelected(null);
                        }}
                      >
                        Hủy
                      </button>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => userSetChangingPassword(true)}
                        >
                          Đổi mật khẩu
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            usersSetList(
                              usersList.map((u) =>
                                u.id === userSelected.id ? userSelected : u
                              )
                            );
                            userSetEditing(false);
                            userSetSelected(null);
                          }}
                        >
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
