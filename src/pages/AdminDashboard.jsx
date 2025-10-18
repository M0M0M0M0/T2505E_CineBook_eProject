import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart as RelineChart, Line, PieChart, Pie, Cell } from "recharts";
import { User, Film, DollarSign, LayoutDashboard, Users, Settings, LineChart as LineChartIcon, Pencil, Eye, X as XIcon, Building } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


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
    { name: "Analytics", icon: <LineChartIcon size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  // Hàm xử lý khi click vào menu
  // XÓA HÀM NÀY (bị trùng)
  // const handleMenuClick = (name) => {
  //   setActiveMenu(name);
  // };

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
      statusColor: "success"
    },
    {
      name: "Galaxy Nguyen Du",
      city: "Ho Chi Minh", 
      address: "116 Nguyen Du, Ben Thanh Ward, District 1",
      rooms: 4,
      seatCapacity: 600,
      status: "Active",
      statusColor: "success"
    },
    // Thêm theaters khác...
  ];

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

  // Xóa state showLoading
  // const [showLoading, setShowLoading] = useState(false);
  
  // Xóa hàm showLoadingScreen
  // const showLoadingScreen = (cb) => {...}

  // Sửa lại các hàm xử lý không dùng loading
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
      name: "",
      city: "",
      address: "",
      rooms: "",
      seatCapacity: "",
    });
    setTheaterError("");
  };

  const handleEditTheater = (theater, idx) => {
    setEditTheater(idx);
    setIsAddTheater(false);
    setTheaterForm({
      name: theater.name,
      city: theater.city,
      address: theater.address,
      rooms: theater.rooms,
      seatCapacity: theater.seatCapacity,
    });
    setTheaterError("");
  };

  const handleTheaterChange = (e) => {
    setTheaterForm({ ...theaterForm, [e.target.name]: e.target.value });
  };

  const handleTheaterSave = () => {
    const required = ["name", "city", "address", "rooms", "seatCapacity"];
    for (let key of required) {
      if (!theaterForm[key] || theaterForm[key].toString().trim() === "") {
        setTheaterError("Please fill all required fields.");
        return;
      }
    }
    setEditTheater(null);
    setTheaterError("");
  };

  const handleAddTheaterSave = () => {
    const required = ["name", "city", "address", "rooms", "seatCapacity"];
    for (let key of required) {
      if (!theaterForm[key] || theaterForm[key].toString().trim() === "") {
        setTheaterError("Please fill all required fields.");
        return;
      }
    }
    setIsAddTheater(false);
    setTheaterError("");
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <h2 className="fw-bold text-danger mb-4">🎟️ FlickTickets</h2>
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
      <main className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm">ENGLISH</button>
            <img
              src="https://via.placeholder.com/40"
              alt="avatar"
              className="rounded-circle"
              width="40"
              height="40"
            />
          </div>
        </div>

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
                        <Line type="monotone" dataKey="value" stroke="#FF6B6B" strokeWidth={3} />
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
                        <Bar dataKey="revenue" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
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
                        <Pie data={topMovies} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                          {topMovies.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                        <img src="https://via.placeholder.com/60" alt="movie" className="rounded" />
                        <div>
                          <p className="fw-semibold mb-0">The Real Ghost</p>
                          <p className="text-muted small mb-0">Release: Oct 30</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center gap-3">
                        <img src="https://via.placeholder.com/60" alt="movie" className="rounded" />
                        <div>
                          <p className="fw-semibold mb-0">Black Widow</p>
                          <p className="text-muted small mb-0">Release: Nov 15</p>
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
          <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: 500 }}>
            <AnimatePresence mode="wait">
              {/* Bảng danh sách phim */}
              {editMovie === null && !isAddMovie && (
                <motion.div
                  key="movie-table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}  // Bỏ transition trong animate
                  exit={{ opacity: 0, y: -20 }}   // Bỏ transition trong exit  
                  transition={{ duration: 0.2 }}  // Chỉ để 1 transition chung
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
                          <td style={{ width: 80 }}>  {/* Thêm width cố định */}
                            <div style={{ width: 48, height: 72 }}>  {/* Thêm div bọc ngoài với kích thước cố định */}
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="rounded"
                                width="48"
                                height="72"
                                style={{ 
                                  objectFit: "cover",
                                  backgroundColor: "#eee" // Thêm background mặc định
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
                            <button className="btn btn-sm btn-light me-1" title="View Detail">
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
                  <h4 className="mb-3">{isAddMovie ? "Add Movie" : "Edit Movie"}</h4>
                  {editError && (
                    <div className="alert alert-danger py-2">{editError}</div>
                  )}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      isAddMovie ? handleAddSave() : handleEditSave();
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label">Movie ID <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="movieId"
                        value={editForm.movieId}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Title <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Poster Path <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="poster"
                        value={editForm.poster}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Genre <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="genre"
                        value={editForm.genre}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="duration"
                        value={editForm.duration}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Trailer Link <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="trailer"
                        value={editForm.trailer}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Overview <span className="text-danger">*</span></label>
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
                      <label className="form-label">Release Date <span className="text-danger">*</span></label>
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
                        onClick={isAddMovie ? handleAddCancel : handleEditCancel}
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
          <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: 500 }}>
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
                    <input type="text" className="form-control w-25" placeholder="Search theaters..." />
                    <button className="btn btn-primary" onClick={handleAddTheater}>
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
                              title="Edit"
                              onClick={() => handleEditTheater(theater, idx)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button className="btn btn-sm btn-light me-1" title="View Detail">
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
                >
                  <h4 className="mb-3">{isAddTheater ? "Add Theater" : "Edit Theater"}</h4>
                  {theaterError && (
                    <div className="alert alert-danger py-2">{theaterError}</div>
                  )}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    isAddTheater ? handleAddTheaterSave() : handleTheaterSave();
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="name"
                        value={theaterForm.name}
                        onChange={handleTheaterChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">City <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="city"
                        value={theaterForm.city}
                        onChange={handleTheaterChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={theaterForm.address}
                        onChange={handleTheaterChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Number of Rooms <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="rooms"
                        value={theaterForm.rooms}
                        onChange={handleTheaterChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Seat Capacity <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="seatCapacity"
                        value={theaterForm.seatCapacity}
                        onChange={handleTheaterChange}
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
                        onClick={() => {
                          setEditTheater(null);
                          setIsAddTheater(false);
                        }}
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

        {activeMenu === "Showtimes" && (
          <div>
          <h2>Showtimes Management</h2>
    <form>
      <div className="mb-3">
        <label className="form-label">Movie</label>
        <select className="form-control" name="movieId" onChange={handleShowtimeChange} value={showtimeForm.movieId}>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>{movie.title}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Theater</label>
        <select className="form-control" name="theaterId" onChange={handleShowtimeChange} value={showtimeForm.theaterId}>
          {theaters.map(theater => (
            <option key={theater.id} value={theater.id}>{theater.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input type="date" className="form-control" name="date" onChange={handleShowtimeChange} value={showtimeForm.date} />
      </div>
      <div className="mb-3">
        <label className="form-label">Time</label>
        <input type="time" className="form-control" name="time" onChange={handleShowtimeChange} value={showtimeForm.time} />
      </div>
      <div className="mb-3">
        <label className="form-label">Room</label>
        <input type="number" className="form-control" name="room" onChange={handleShowtimeChange} value={showtimeForm.room} />
      </div>
      <div className="mb-3">
        <label className="form-label">Price</label>
        <input type="number" className="form-control" name="price" onChange={handleShowtimeChange} value={showtimeForm.price} />
      </div>
      {showtimeError && (
        <div className="alert alert-danger py-2">{showtimeError}</div>
      )}
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success">
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowtime(null);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

        {activeMenu === "Analytics" && (
          <div>
            <h2>Analytics</h2>
            {/* Thêm nội dung phân tích ở đây */}
          </div>
        )}

        {activeMenu === "Settings" && (
          <div>
            <h2>Settings</h2>
            {/* Thêm nội dung cài đặt ở đây */}
          </div>
        )}
      </main>
    </div>
  );
}
