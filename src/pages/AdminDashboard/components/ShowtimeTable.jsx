import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShowtimeForm from "./ShowtimeForm";

export default function AdminDashboard() {
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [activeMenu, setActiveMenu] = useState("Showtimes");

  useEffect(() => {
    // Fetch movies and showtimes
    Promise.all([
      fetch("http://127.0.0.1:8000/api/movies").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/showtimes").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/theaters").then((res) => res.json()),
    ])
      .then(([moviesData, showtimesData, theatersData]) => {
        setMovies(moviesData);
        setShowtimes(showtimesData);
        setTheaters(theatersData);

        // Extract unique cities from theaters
        const uniqueCities = [...new Set(theatersData.map((t) => t.city))];
        setCities(uniqueCities);
      })
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  // Load rooms khi chọn rạp
  useEffect(() => {
    if (!selectedTheater) return;

    fetch(`http://127.0.0.1:8000/api/theaters/${selectedTheater}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Failed to load rooms:", err));
  }, [selectedTheater]);

  const handleSelectShowtime = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedMovie) queryParams.append("movie_id", selectedMovie);
      if (selectedTheater) queryParams.append("theater_id", selectedTheater);

      const res = await fetch(
        `http://127.0.0.1:8000/api/showtimes?${queryParams}`
      );
      const data = await res.json();
      setFilteredShowtimes(data);
    } catch (err) {
      console.error("Failed to load showtimes:", err);
    }
  };

  const handleSaveShowtime = async (showtime) => {
    try {
      const url = showtime.id
        ? `http://127.0.0.1:8000/api/showtimes/${showtime.id}`
        : "http://127.0.0.1:8000/api/showtimes";

      const res = await fetch(url, {
        method: showtime.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(showtime),
      });

      if (!res.ok) throw new Error("Failed to save");

      handleSelectShowtime(); // Reload data
    } catch (err) {
      console.error("Failed to save showtime:", err);
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm("Delete this showtime?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/showtimes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      handleSelectShowtime(); // Reload data
    } catch (err) {
      console.error("Failed to delete showtime:", err);
    }
  };

  return (
    <div className="container-xxl p-4">
      <h2 className="mb-4">🎬 Movie Theater Admin</h2>

      {/* --- MENU --- */}
      <div className="mb-4">
        <button
          className={`btn btn-outline-primary me-2 ${
            activeMenu === "Showtimes" ? "active" : ""
          }`}
          onClick={() => setActiveMenu("Showtimes")}
        >
          Manage Showtimes
        </button>
        <button
          className={`btn btn-outline-secondary ${
            activeMenu === "Theaters" ? "active" : ""
          }`}
          onClick={() => setActiveMenu("Theaters")}
        >
          Manage Theaters
        </button>
      </div>

      {/* /*Show Time */}
      {activeMenu === "Showtimes" && (
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
          onAddShowtime={() => {
            setFilteredShowtimes([
              ...filteredShowtimes,
              {
                id: null,
                movie_id: selectedMovie,
                theater_id: selectedTheater,
                room_id: "",
                show_date: "",
                show_time: "",
                price: "",
                isEditing: true,
              },
            ]);
          }}
          onEditShowtime={(showtime) => {
            const updated = [...filteredShowtimes];
            const idx = updated.findIndex((s) => s.id === showtime.id);
            if (idx !== -1) {
              updated[idx].isEditing = true;
              setFilteredShowtimes(updated);
            }
          }}
          onDeleteShowtime={(id) => {
            handleDeleteShowtime(id);
          }}
        />
      )}

      {/* --- Showtime Form (for Add/Edit) --- */}
      {activeMenu === "Showtimes" &&
        filteredShowtimes.some((s) => s.isEditing) && (
          <ShowtimeForm
            showtime={filteredShowtimes.find((s) => s.isEditing)}
            rooms={rooms}
            onSave={(showtime) => {
              handleSaveShowtime(showtime);
            }}
            onCancel={() => {
              const updated = [...filteredShowtimes];
              updated.forEach((s) => (s.isEditing = false));
              setFilteredShowtimes(updated);
            }}
          />
        )}
    </div>
  );
}
