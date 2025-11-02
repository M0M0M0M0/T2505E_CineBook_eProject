/**
 * ComingSoon.jsx
 * Trang danh sách phim sắp chiếu — lấy dữ liệu từ API /api/movies
 * Hiển thị các phim KHÔNG nằm trong top 20 phim cuối (tức phần đầu danh sách)
 */

import React, { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import "./Movies.css"; // dùng lại CSS từ Movies

function ComingSoon() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [banners] = useState([
    { img: "banner1.jpg", title: "Banner 1" },
    { img: "banner2.jpg", title: "Banner 2" },
    { img: "banner3.jpg", title: "Banner 3" },
  ]);

  // ✅ Gọi API và chia dữ liệu
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/movies");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();

        // ✅ Lấy tất cả trừ 20 phim cuối (Coming Soon)
        const comingSoon = data.slice(0, data.length - 20);

        setMovies(comingSoon);
        setFilteredMovies(comingSoon);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Lọc & tìm kiếm
  useEffect(() => {
    let results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGenre) {
      results = results.filter((movie) =>
        movie.genres?.some((g) =>
          g.name.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );
    }

    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, movies]);

  return (
    <div className="movies-page-container bg-dark text-light min-vh-100">
      <HeroBanner
        title="Coming Soon"
        subtitle="Upcoming movies — stay tuned!"
        banners={banners}
      />

      <div className="movies-controls container my-4">
        <SearchBar
          placeholder="Search for upcoming movies..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="movies-list container pb-5">
        <div className="row g-4">
          {filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="col-6 col-md-4 col-lg-3">
              <MovieCard
                movie={{
                  title: movie.title,
                  genre: movie.genres?.map((g) => g.name).join(", "),
                  rating: movie.vote_average,
                  votes: movie.vote_count || 0,
                  img: movie.poster_path,
                  promoted: movie.promoted || false,
                  trailer_link: movie.trailer_link,
                  movie_id: movie.movie_id,
                  overview: movie.overview,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
