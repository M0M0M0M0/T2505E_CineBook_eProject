import { useState } from "react";
import { MapPin, Film, Clock, ChevronDown } from "lucide-react";

// --- Dữ liệu mẫu ---
// Trong một ứng dụng thực tế, dữ liệu này sẽ được lấy từ API
const theatersData = [
  {
    id: 1,
    name: "CGV Vincom Center Bà Triệu",
    address: "Tầng 6, Vincom Center, 191 Bà Triệu, Hai Bà Trưng",
    region: "Hà Nội",
    movies: [
      {
        id: 101,
        title: "Lật Mặt 7: Một Điều Ước",
        poster: "https://placehold.co/100x150/000000/FFFFFF?text=Lat+Mat+7",
        showtimes: ["18:00", "19:30", "20:45", "21:15", "22:00"],
      },
      {
        id: 102,
        title: "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
        poster: "https://placehold.co/100x150/3498db/FFFFFF?text=Doraemon",
        showtimes: ["17:45", "19:00", "20:10"],
      },
      {
        id: 103,
        title: "Hành Tinh Khỉ: Vương Quốc Mới",
        poster: "https://placehold.co/100x150/e67e22/FFFFFF?text=Planet+Apes",
        showtimes: ["19:20", "21:50"],
      },
    ],
  },
  {
    id: 2,
    name: "Lotte Cinema Landmark 72",
    address: "Tầng 5, Keangnam Hanoi Landmark Tower, E6, Cầu Giấy",
    region: "Hà Nội",
    movies: [
      {
        id: 101,
        title: "Lật Mặt 7: Một Điều Ước",
        poster: "https://placehold.co/100x150/000000/FFFFFF?text=Lat+Mat+7",
        showtimes: ["18:30", "20:00", "22:10"],
      },
      {
        id: 104,
        title: "Garfield: Mèo Béo Siêu Quậy",
        poster: "https://placehold.co/100x150/f1c40f/000000?text=Garfield",
        showtimes: ["17:00", "18:45", "20:30"],
      },
    ],
  },
  {
    id: 3,
    name: "BHD Star Vincom Thảo Điền",
    address: "Tầng 5, Vincom Mega Mall, 159 Xa lộ Hà Nội, Quận 2",
    region: "TP. Hồ Chí Minh",
    movies: [
      {
        id: 101,
        title: "Lật Mặt 7: Một Điều Ước",
        poster: "https://placehold.co/100x150/000000/FFFFFF?text=Lat+Mat+7",
        showtimes: ["19:00", "20:30", "21:45"],
      },
      {
        id: 103,
        title: "Hành Tinh Khỉ: Vương Quốc Mới",
        poster: "https://placehold.co/100x150/e67e22/FFFFFF?text=Planet+Apes",
        showtimes: ["20:00", "22:25"],
      },
      {
        id: 104,
        title: "Garfield: Mèo Béo Siêu Quậy",
        poster: "https://placehold.co/100x150/f1c40f/000000?text=Garfield",
        showtimes: ["17:15", "19:10", "21:05"],
      },
    ],
  },
  {
    id: 4,
    name: "Galaxy Cinema Nguyễn Du",
    address: "116 Nguyễn Du, Phường Bến Thành, Quận 1",
    region: "TP. Hồ Chí Minh",
    movies: [
      {
        id: 102,
        title: "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
        poster: "https://placehold.co/100x150/3498db/FFFFFF?text=Doraemon",
        showtimes: ["18:15", "19:40", "20:50"],
      },
    ],
  },
  {
    id: 5,
    name: "Metiz Cinema",
    address: "Tầng 1, Helio Center, Đường 2/9, Hải Châu",
    region: "Đà Nẵng",
    movies: [
      {
        id: 101,
        title: "Lật Mặt 7: Một Điều Ước",
        poster: "https://placehold.co/100x150/000000/FFFFFF?text=Lat+Mat+7",
        showtimes: ["19:15", "21:00"],
      },
    ],
  },
];

// Lấy danh sách khu vực duy nhất từ dữ liệu
const regions = ["Tất cả", ...new Set(theatersData.map((t) => t.region))];

// --- Component con: MovieCard ---
const MovieCard = ({ movie }) => (
  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 py-6 border-b border-gray-200 last:border-b-0">
    <img
      src={movie.poster}
      alt={`Poster phim ${movie.title}`}
      className="w-24 h-36 object-cover rounded-md flex-shrink-0"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/100x150/cccccc/FFFFFF?text=Error";
      }}
    />
    <div className="flex-grow">
      <h4 className="text-lg font-bold text-gray-800">{movie.title}</h4>
      <p className="text-sm text-gray-500 mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Suất chiếu
      </p>
      <div className="flex flex-wrap gap-2">
        {movie.showtimes.map((time) => (
          <button
            key={time}
            className="px-4 py-2 bg-sky-100 text-sky-700 font-semibold rounded-lg text-sm hover:bg-sky-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// --- Component con: TheaterCard ---
const TheaterCard = ({ theater }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] mb-8">
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900">{theater.name}</h3>
      <div className="flex items-center text-gray-600 mt-2 text-sm">
        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>{theater.address}</span>
      </div>
    </div>
    <div className="px-6 pb-2">
      <h4 className="text-md font-semibold text-gray-700 mb-2 border-t pt-4 flex items-center">
        <Film className="w-5 h-5 mr-2" />
        Phim đang chiếu
      </h4>
      {theater.movies.length > 0 ? (
        theater.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      ) : (
        <p className="text-gray-500 py-4">Chưa có lịch chiếu cho rạp này.</p>
      )}
    </div>
  </div>
);

// --- Component chính: App ---
export default function Theaters() {
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const filteredTheaters =
    selectedRegion === "Tất cả"
      ? theatersData
      : theatersData.filter((theater) => theater.region === selectedRegion);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5">Lịch Chiếu Phim</h1>
          <p className="text-muted">Chọn rạp và đặt vé ngay hôm nay!</p>
        </header>

        {/* Bộ lọc khu vực */}
        <div className="d-flex justify-content-center mb-4">
          <div className="col-md-4">
            <select
              className="form-select shadow-sm"
              value={selectedRegion}
              onChange={handleRegionChange}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách rạp */}
        <main>
          {filteredTheaters.length > 0 ? (
            filteredTheaters.map((theater) => (
              <div key={theater.id} className="card mb-4 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{theater.name}</h5>
                  <p className="text-muted small mb-3">
                    <MapPin size={16} className="me-2 text-secondary" />
                    {theater.address}
                  </p>

                  <h6 className="fw-semibold border-top pt-3 mb-3">
                    <Film size={18} className="me-2 text-primary" />
                    Phim đang chiếu
                  </h6>

                  {theater.movies.length > 0 ? (
                    theater.movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="row align-items-start border-bottom pb-3 mb-3"
                      >
                        <div className="col-md-2 col-sm-3 mb-3">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="img-fluid rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/100x150/cccccc/FFFFFF?text=Error";
                            }}
                          />
                        </div>
                        <div className="col-md-10 col-sm-9">
                          <h6 className="fw-bold">{movie.title}</h6>
                          <p className="text-secondary small mb-2">
                            <Clock size={14} className="me-2" />
                            Suất chiếu
                          </p>
                          <div className="d-flex flex-wrap gap-2">
                            {movie.showtimes.map((time) => (
                              <button
                                key={time}
                                className="btn btn-outline-primary btn-sm"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">
                      Chưa có lịch chiếu cho rạp này.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center card p-5 shadow-sm">
              <h5 className="fw-semibold text-secondary">
                Không tìm thấy rạp chiếu phim
              </h5>
              <p className="text-muted">Vui lòng thử chọn một khu vực khác.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
