import React, { useState, useEffect } from "react";
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
import DashboardStats from "./components/DashboardStats";
import MovieTable from "./components/MovieTable";
import MovieForm from "./components/MovieForm";
import TheaterTable from "./components/TheaterTable";
import TheaterForm from "./components/TheaterForm";
import RoomManager from "./components/RoomManager";
import UserTable from "./components/UserTable";
import UserDetail from "./components/UserDetail";
import UserEdit from "./components/UserEdit";
import ShowtimeTable from "./components/ShowtimeTable";
import ShowtimeForm from "./components/ShowtimeForm";
import PricingManager from "./components/PricingManager";

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

  // --- Showtime data (from Laravel API) ---
  const [cities, setCities] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);

  const [filteredShowtimes, setFilteredShowtimes] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");

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
  //State cho tìm kiếm trong movie admin dash board
  const [movieSearch, setMovieSearch] = useState("");

  // State cho add movie
  const [isAddMovie, setIsAddMovie] = useState(false);

  // Xử lý khi nhấn Select

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

  //Chinh Pricing
  const [editingSeats, setEditingSeats] = useState(false);
  const [editingDays, setEditingDays] = useState(false);
  const [editingTimes, setEditingTimes] = useState(false);

  const [seatTypes, setSeatTypes] = useState([
    { seat_type_id: "ST1", seat_type_name: "Standard", seat_type_price: 50000 },
    { seat_type_id: "ST2", seat_type_name: "VIP", seat_type_price: 80000 },
  ]);

  // day modifiers
  const [dayModifiers, setDayModifiers] = useState([]); // load from API or initial state
  const [dayEditing, setDayEditing] = useState(false);

  // time slots
  const [timeSlots, setTimeSlots] = useState([]); // load from API or initial state
  const [timeEditing, setTimeEditing] = useState(false);

  // helper to create short unique IDs for new rows
  const genTempId = (prefix = "X") =>
    `${prefix}${Date.now().toString().slice(-6)}`;

  // --- DAY MODIFIERS: add / delete ---
  const handleAddDayModifier = () => {
    const newRow = {
      day_modifier_id: genTempId("D"),
      day_type: "New Day",
      modifier_type: "percent", // 'percent' or 'fixed'
      modifier_amount: 0,
      operation: "increase", // 'increase' or 'decrease'
      is_active: true,
      __isNew: true,
    };
    setDayModifiers([newRow, ...dayModifiers]);
  };

  const handleDeleteDayModifier = (id) => {
    // If the row is a temporary new row (__isNew) just remove it,
    // otherwise remove it locally — later you can call DELETE /api/day-modifiers/:id
    const row = dayModifiers.find((r) => r.day_modifier_id === id);
    if (row?.__isNew) {
      setDayModifiers(dayModifiers.filter((r) => r.day_modifier_id !== id));
    } else {
      // remove locally; optionally add to a deleted list to sync with API later
      setDayModifiers(dayModifiers.filter((r) => r.day_modifier_id !== id));
      // TODO: call your API to delete immediately, or collect for batch delete
      // fetch(`/api/day-modifiers/${id}`, { method: 'DELETE' })
    }
  };

  // --- TIME SLOTS: add / delete ---
  const handleAddTimeSlot = () => {
    const newRow = {
      time_slot_modifier_id: genTempId("TS"),
      time_slot_name: "New Slot",
      ts_start_time: "08:00:00",
      ts_end_time: "10:00:00",
      modifier_type: "percent", // 'percent' or 'fixed'
      ts_amount: 0,
      operation: "increase",
      is_active: true,
      __isNew: true,
    };
    setTimeSlots([newRow, ...timeSlots]);
  };

  const handleDeleteTimeSlot = (id) => {
    const row = timeSlots.find((r) => r.time_slot_modifier_id === id);
    if (row?.__isNew) {
      setTimeSlots(timeSlots.filter((r) => r.time_slot_modifier_id !== id));
    } else {
      setTimeSlots(timeSlots.filter((r) => r.time_slot_modifier_id !== id));
      // TODO: optionally call DELETE API here
      // fetch(`/api/time-slot-modifiers/${id}`, { method: 'DELETE' })
    }
  };

  const handleMenuClick = (name) => {
    if (name === activeMenu) return;
    setActiveMenu(name);
    setEditMovie(null);
    setIsAddMovie(false);
    setEditError("");
  };

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  const handleEdit = (movie, idx) => {
    setEditMovie(idx);
    setIsAddMovie(false);
    setEditForm({
      movie_id: movie.movie_id || "",
      title: movie.title || "",
      original_title: movie.original_title || "",
      original_language: movie.original_language || "",
      duration: movie.duration || "",
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      trailer_link: movie.trailer_link || "",
      genres: Array.isArray(movie.genres) ? movie.genres.map(g => g.genre_id) : [],
      overview: movie.overview || "",
      release_date: movie.release_date || "",
    });
    setEditError("");
  };

  const handleAddMovie = () => {
    setIsAddMovie(true);
    setEditMovie(null);
    setEditForm({
      movie_id: "",
      title: "",
      original_title: "",
      original_language: "",
      duration: "",
      poster_path: "",
      backdrop_path: "",
      trailer_link: "",
      genres: "",
      overview: "",
      release_date: "",
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
    if (!newSeat.seat_row || !newSeat.seat_number || !newSeat.seat_type_id)
      return;
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
    const required = [
      "theater_name",
      "theater_city",
      "theater_address",
      "theater_capacity",
    ];
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
    const required = [
      "theater_name",
      "theater_city",
      "theater_address",
      "theater_capacity",
    ];
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

  // State cho Showtime
  const [showAddShowtime, setShowAddShowtime] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);

  // Load initial data
  useEffect(() => {
    // Load cities
    fetch("http://127.0.0.1:8000/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));

    // Load theaters
    fetch("http://127.0.0.1:8000/api/theaters")
      .then((res) => res.json())
      .then((data) => setTheaters(data));

    // Load movies
    fetch("http://127.0.0.1:8000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));

    // Load showtimes
    fetch("http://127.0.0.1:8000/api/showtimes")
      .then((res) => res.json())
      .then((data) => setFilteredShowtimes(data))
      .catch((err) => console.error("Failed to load showtimes:", err));
  }, []);

  // Showtime handlers
  const handleAddShowtime = () => {
    setShowAddShowtime(true);
    setEditingShowtime(null);
  };

  const handleEditShowtime = (showtime) => {
    setEditingShowtime(showtime);
    setShowAddShowtime(true);
  };

  const handleSaveShowtime = async (formData) => {
    try {
      // Map form data to API format
      const apiData = {
        movie_id: formData.movie_id,
        theater_id: formData.theater_id,
        room_id: formData.room_id,
        show_date: formData.show_date || formData.date,
        show_time: formData.show_time || formData.start_time,
        price: formData.price,
        status: formData.status || "Available",
      };

      // Use correct ID field
      const showtimeId = editingShowtime?.showtime_id;

      const url = showtimeId
        ? `http://127.0.0.1:8000/api/showtimes/${showtimeId}`
        : "http://127.0.0.1:8000/api/showtimes";

      console.log("Saving showtime:", {
        url,
        method: showtimeId ? "PUT" : "POST",
        data: apiData,
      });

      const res = await fetch(url, {
        method: showtimeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const responseData = await res.json();
      console.log("Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save showtime");
      }

      // Reload all showtimes from API to ensure fresh data
      const reloadRes = await fetch("http://127.0.0.1:8000/api/showtimes");
      const allShowtimes = await reloadRes.json();
      setFilteredShowtimes(allShowtimes);

      setShowAddShowtime(false);
      setEditingShowtime(null);

      alert(
        showtimeId
          ? "Showtime updated successfully!"
          : "Showtime created successfully!"
      );
    } catch (err) {
      console.error("Error saving showtime:", err);
      alert(`Failed to save showtime: ${err.message}`);
    }
  };

  const handleDeleteShowtime = async (showtimeId) => {
    if (!window.confirm("Are you sure you want to delete this showtime?"))
      return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/showtimes/${showtimeId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete showtime");
      }

      // Remove from state
      setFilteredShowtimes((prev) =>
        prev.filter((s) => s.showtime_id !== showtimeId)
      );

      alert("Showtime deleted successfully!");
    } catch (err) {
      console.error("Error deleting showtime:", err);
      alert(`Failed to delete showtime: ${err.message}`);
    }
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
              className={`d-flex align-items-center gap-2 p-2 rounded cursor-pointer ${activeMenu === item.name
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
          <DashboardStats
            salesData={salesData}
            revenueData={revenueData}
            topMovies={topMovies}
            COLORS={COLORS}
          />
        )}

        {activeMenu === "Movies" && (
          <>
            {editMovie === null && !isAddMovie ? (
              <MovieTable
                movies={movies}
                handleEdit={handleEdit}
                handleAddMovie={handleAddMovie}
                movieSearch={movieSearch}
                setMovieSearch={setMovieSearch}
              />

            ) : (
              <MovieForm
                isAddMovie={isAddMovie}
                editForm={editForm}
                editError={editError}
                handleEditChange={handleEditChange}
                handleAddSave={handleAddSave}
                handleEditSave={handleEditSave}
                handleAddCancel={handleAddCancel}
                handleEditCancel={handleEditCancel}
                genres={genres}
              />
            )}
          </>
        )}

        {activeMenu === "Theaters" && (
          <>
            {editTheater === null && !isAddTheater ? (
              <TheaterTable
                theaters={theaters}
                handleEditTheater={handleEditTheater}
                handleManageRooms={handleManageRooms}
                handleAddTheater={handleAddTheater}
              />
            ) : (
              <TheaterForm
                isAddTheater={isAddTheater}
                theaterForm={theaterForm}
                theaterError={theaterError}
                handleTheaterChange={handleTheaterChange}
                handleAddTheaterSave={handleAddTheaterSave}
                handleTheaterSave={handleTheaterSave}
                setEditTheater={setEditTheater}
                setIsAddTheater={setIsAddTheater}
              />
            )}
            {showManageRooms && selectedTheaterForRooms && (
              <RoomManager
                showManageRooms={showManageRooms}
                selectedTheaterForRooms={selectedTheaterForRooms}
                rooms={rooms}
                newRoom={newRoom}
                setNewRoom={setNewRoom}
                handleAddRoom={handleAddRoom}
                handleDeleteRoom={handleDeleteRoom}
                handleViewSeats={handleViewSeats}
                selectedRoom={selectedRoom}
                seats={seats}
                newSeat={newSeat}
                setNewSeat={setNewSeat}
                handleAddSeat={handleAddSeat}
                handleDeleteSeat={handleDeleteSeat}
                setShowManageRooms={setShowManageRooms}
                setSelectedTheaterForRooms={setSelectedTheaterForRooms}
                setSelectedRoom={setSelectedRoom}
              />
            )}
          </>
        )}

        {activeMenu === "Users" && (
          <>
            <UserTable
              usersList={usersList}
              userSearch={userSearch}
              userFilterStatus={userFilterStatus}
              userSetSearch={userSetSearch}
              userSetFilterStatus={userSetFilterStatus}
              userSetSelected={userSetSelected}
              userSetEditing={userSetEditing}
              usersSetList={usersSetList}
            />
            {userSelected && !userEditing && (
              <UserDetail
                userSelected={userSelected}
                userSetEditing={userSetEditing}
                userSetSelected={userSetSelected}
              />
            )}
            {userSelected && userEditing && (
              <UserEdit
                userSelected={userSelected}
                userSetSelected={userSetSelected}
                userSetEditing={userSetEditing}
                userSetChangingPassword={userSetChangingPassword}
                usersSetList={usersSetList}
                usersList={usersList}
              />
            )}
          </>
        )}

        {activeMenu === "Showtimes" && (
          <>
            {!showAddShowtime ? (
              <ShowtimeTable
                cities={cities}
                theaters={theaters}
                movies={movies}
                selectedCity={selectedCity}
                selectedTheater={selectedTheater}
                selectedMovie={selectedMovie}
                setSelectedCity={setSelectedCity}
                setSelectedTheater={setSelectedTheater}
                setSelectedMovie={setSelectedMovie}
                filteredShowtimes={filteredShowtimes}
                onAddShowtime={handleAddShowtime}
                onEditShowtime={handleEditShowtime}
                onDeleteShowtime={handleDeleteShowtime}
              />
            ) : (
              <ShowtimeForm
                movies={movies}
                theaters={theaters}
                editingShowtime={editingShowtime}
                onSave={handleSaveShowtime}
                onCancel={() => {
                  setShowAddShowtime(false);
                  setEditingShowtime(null);
                }}
              />
            )}
          </>
        )}
        {activeMenu === "Pricing" && (
          <PricingManager
            seatTypes={seatTypes}
            setSeatTypes={setSeatTypes}
            dayModifiers={dayModifiers}
            setDayModifiers={setDayModifiers}
            timeSlots={timeSlots}
            setTimeSlots={setTimeSlots}
            genTempId={genTempId} // Dùng helper ID từ component cha
          />
        )}

        {/* ...existing code... */}
      </main>
    </div>
  );
}
