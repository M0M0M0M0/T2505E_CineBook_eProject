import React, { useState, useEffect } from "react";

export default function ShowtimeSelector({ onSelectShowtime }) {
  const [showtimesData, setShowtimesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const movieId = window.location.pathname.split("/").pop();

        console.log("Fetching showtimes for movie:", movieId);

        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${movieId}/showtimes`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Received data:", data);

        setShowtimesData(data);

        // Extract unique cities from all showtimes
        if (data.showtimes_by_date) {
          const allCities = new Set();
          Object.values(data.showtimes_by_date).forEach((dateGroup) => {
            dateGroup.forEach((theater) => {
              allCities.add(theater.theater_city);
            });
          });
          const cityList = Array.from(allCities).sort();
          setCities(cityList);

          // DON'T auto-select anything - let user choose
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  // Update theaters list when city changes
  useEffect(() => {
    if (!showtimesData || !selectedCity) {
      setTheaters([]);
      setSelectedTheater("");
      setDates([]);
      setSelectedDate("");
      return;
    }

    // Get all theaters in the selected city across all dates
    const cityTheaterMap = new Map();
    Object.values(showtimesData.showtimes_by_date).forEach((dateGroup) => {
      dateGroup.forEach((theater) => {
        if (theater.theater_city === selectedCity) {
          cityTheaterMap.set(theater.theater_id, {
            id: theater.theater_id,
            name: theater.theater_name,
          });
        }
      });
    });

    const theaterList = Array.from(cityTheaterMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setTheaters(theaterList);

    // Reset theater and subsequent selections
    setSelectedTheater("");
    setDates([]);
    setSelectedDate("");
  }, [selectedCity, showtimesData]);

  // Update dates list when theater is selected
  useEffect(() => {
    if (!showtimesData || !selectedCity || !selectedTheater) {
      setDates([]);
      setSelectedDate("");
      return;
    }

    // Get all dates that have showtimes for this theater
    const availableDates = [];
    Object.entries(showtimesData.showtimes_by_date).forEach(
      ([date, theaters]) => {
        const hasTheater = theaters.some(
          (t) =>
            t.theater_id === selectedTheater && t.theater_city === selectedCity
        );
        if (hasTheater) {
          availableDates.push(date);
        }
      }
    );

    setDates(availableDates.sort());

    // Reset date selection
    setSelectedDate("");
  }, [selectedTheater, selectedCity, showtimesData]);

  if (loading) {
    return (
      <div style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>⏳</div>
        <p>Đang tải lịch chiếu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "#fff",
          padding: "30px",
          background: "#ff4444",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          ❌ Lỗi: {error}
        </p>
        <p style={{ fontSize: "14px" }}>
          Vui lòng kiểm tra API và dữ liệu phim
        </p>
      </div>
    );
  }

  if (
    !showtimesData ||
    !showtimesData.showtimes_by_date ||
    Object.keys(showtimesData.showtimes_by_date).length === 0
  ) {
    return (
      <div
        style={{
          color: "#fff",
          padding: "30px",
          background: "#1a1a1a",
          borderRadius: "10px",
          textAlign: "center",
          border: "2px dashed #555",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>📅</p>
        <p>Chưa có lịch chiếu cho phim này</p>
        <p style={{ fontSize: "14px", color: "#888", marginTop: "10px" }}>
          Phim: {showtimesData?.movie_title || "Unknown"}
        </p>
      </div>
    );
  }

  // Get filtered theaters for display
  const getFilteredTheaters = () => {
    if (!selectedDate) return [];

    const dateShowtimes = showtimesData.showtimes_by_date[selectedDate] || [];
    return dateShowtimes.filter(
      (theater) =>
        theater.theater_city === selectedCity &&
        theater.theater_id === selectedTheater
    );
  };

  const filteredTheaters = getFilteredTheaters();

  return (
    <div style={{ color: "#fff", padding: "20px" }}>
      <h4 style={{ marginBottom: "30px", fontSize: "24px" }}>
        🎬 {showtimesData.movie_title}
      </h4>

      {/* STEP 1: City Filter */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "#1a1a1a",
          borderRadius: "10px",
          border: "2px solid #333",
        }}
      >
        <h5 style={{ marginBottom: "15px", color: "#f90" }}>
          🏙️ Step 1: Choose City
        </h5>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: "12px 24px",
                background: selectedCity === city ? "#f90" : "#2a2a2a",
                border: "2px solid",
                borderColor: selectedCity === city ? "#f90" : "#444",
                borderRadius: "8px",
                color: selectedCity === city ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: selectedCity === city ? "bold" : "normal",
                fontSize: "16px",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                if (selectedCity !== city) {
                  e.currentTarget.style.background = "#333";
                  e.currentTarget.style.borderColor = "#555";
                }
              }}
              onMouseOut={(e) => {
                if (selectedCity !== city) {
                  e.currentTarget.style.background = "#2a2a2a";
                  e.currentTarget.style.borderColor = "#444";
                }
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Theater Filter - Only show if city is selected */}
      {selectedCity && theaters.length > 0 && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#1a1a1a",
            borderRadius: "10px",
            border: "2px solid #333",
          }}
        >
          <h5 style={{ marginBottom: "15px", color: "#f90" }}>
            🏢 Step 2: Choose Theater
          </h5>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {theaters.map((theater) => (
              <button
                key={theater.id}
                onClick={() => setSelectedTheater(theater.id)}
                style={{
                  padding: "12px 24px",
                  background:
                    selectedTheater === theater.id ? "#f90" : "#2a2a2a",
                  border: "2px solid",
                  borderColor: selectedTheater === theater.id ? "#f90" : "#444",
                  borderRadius: "8px",
                  color: selectedTheater === theater.id ? "#000" : "#fff",
                  cursor: "pointer",
                  fontWeight:
                    selectedTheater === theater.id ? "bold" : "normal",
                  fontSize: "16px",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  if (selectedTheater !== theater.id) {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.borderColor = "#555";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTheater !== theater.id) {
                    e.currentTarget.style.background = "#2a2a2a";
                    e.currentTarget.style.borderColor = "#444";
                  }
                }}
              >
                {theater.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Date Selector - Only show if theater is selected */}
      {selectedTheater && dates.length > 0 && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#1a1a1a",
            borderRadius: "10px",
            border: "2px solid #333",
          }}
        >
          <h5 style={{ marginBottom: "15px", color: "#f90" }}>
            📅 Step 3: Choose Date
          </h5>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {dates.map((date) => {
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString("vi-VN", {
                weekday: "short",
              });
              const dateStr = dateObj.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              });

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    padding: "15px 20px",
                    background: selectedDate === date ? "#f90" : "#2a2a2a",
                    border: "2px solid",
                    borderColor: selectedDate === date ? "#f90" : "#444",
                    borderRadius: "8px",
                    color: selectedDate === date ? "#000" : "#fff",
                    cursor: "pointer",
                    fontWeight: selectedDate === date ? "bold" : "normal",
                    minWidth: "100px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    if (selectedDate !== date) {
                      e.currentTarget.style.background = "#333";
                      e.currentTarget.style.borderColor = "#555";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedDate !== date) {
                      e.currentTarget.style.background = "#2a2a2a";
                      e.currentTarget.style.borderColor = "#444";
                    }
                  }}
                >
                  <div style={{ fontSize: "14px" }}>{dayName}</div>
                  <div style={{ fontSize: "16px", marginTop: "5px" }}>
                    {dateStr}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Showtimes - Only show if date is selected */}
      {selectedDate && (
        <div
          style={{
            padding: "20px",
            background: "#1a1a1a",
            borderRadius: "10px",
            border: "2px solid #333",
          }}
        >
          <h5 style={{ marginBottom: "15px", color: "#f90" }}>
            🎫 Step 4: Choose Showtime
          </h5>

          {filteredTheaters.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#888",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "10px" }}>😔</p>
              <p>No showtimes available for this date.</p>
            </div>
          ) : (
            filteredTheaters.map((theater) => (
              <div
                key={theater.theater_id}
                style={{
                  background: "#0a0a0a",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  border: "1px solid #222",
                }}
              >
                {/* Theater Info */}
                <div
                  style={{
                    marginBottom: "15px",
                    borderBottom: "1px solid #333",
                    paddingBottom: "10px",
                  }}
                >
                  <h6
                    style={{
                      color: "#f90",
                      marginBottom: "8px",
                      fontSize: "18px",
                    }}
                  >
                    🏢 {theater.theater_name}
                  </h6>
                  <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                    📍 {theater.theater_address}, {theater.theater_city}
                  </p>
                </div>

                {/* Showtimes */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {theater.showtimes.map((showtime) => (
                    <button
                      key={showtime.showtime_id}
                      onClick={() =>
                        onSelectShowtime({
                          showtime_id: showtime.showtime_id,
                          room_id: showtime.room_id,
                          room_name: showtime.room_name,
                          theater_id: theater.theater_id,
                          theater_name: theater.theater_name,
                          theater_address: theater.theater_address,
                          theater_city: theater.theater_city,
                          date: selectedDate,
                          start_time: showtime.start_time,
                          end_time: showtime.end_time,
                          base_price: showtime.base_price,
                          status: showtime.status,
                        })
                      }
                      disabled={showtime.status !== "Available"}
                      style={{
                        padding: "18px 24px",
                        background:
                          showtime.status === "Available"
                            ? "#2a2a2a"
                            : "#1a1a1a",
                        border: "2px solid",
                        borderColor:
                          showtime.status === "Available"
                            ? "rgb(255, 153, 0)"
                            : "#333",
                        borderRadius: "10px",
                        color:
                          showtime.status === "Available" ? "#fff" : "#555",
                        cursor:
                          showtime.status === "Available"
                            ? "pointer"
                            : "not-allowed",
                        minWidth: "150px",
                        textAlign: "center",
                        transition: "all 0.3s",
                      }}
                      onMouseOver={(e) => {
                        if (showtime.status === "Available") {
                          e.currentTarget.style.background = "#2a2a2a";
                          e.currentTarget.style.borderColor =
                            "rgb(255, 153, 0)";
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgb(255, 153, 0)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (showtime.status === "Available") {
                          e.currentTarget.style.background = "#2a2a2a";
                          e.currentTarget.style.borderColor =
                            "rgb(255, 153, 0)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        {showtime.start_time}
                      </div>

                      {showtime.status !== "Available" && (
                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "8px",
                            color: "#ff6b6b",
                            fontWeight: "bold",
                          }}
                        >
                          {showtime.status === "Full"
                            ? "❌ Sold Out"
                            : "🚫 Cancelled"}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
