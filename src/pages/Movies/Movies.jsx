/**
 * Movies.jsx
 * Trang danh sách phim — gồm HeroBanner, SearchBar, FilterPanel, MovieCardList, Offers.
 * Dữ liệu lấy từ src/assets/json/movies.json (dữ liệu giả, mock data).
 */

import React, { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import MovieCardList from "./components/MovieCardList";
import Offers from "./components/Offers";
import "./Movies.css";


// ✅ Import JSON giả từ src/assets/json/
import moviesData from "../../assets/json/movies.json";

function Movies() {
  const [movies, setMovies] = useState([]); // Toàn bộ phim
  const [filteredMovies, setFilteredMovies] = useState([]); // Phim sau khi lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    // ✅ Dùng new URL() để Vite xử lý đường dẫn ảnh tương đối trong JSON
    const withImageURL = moviesData.map((movie) => ({
      ...movie,
      poster: new URL(`../../assets/images/${movie.poster}`, import.meta.url).href,
    }));
    console.log('DEBUG: loaded movies with posters:', withImageURL.map(m => m.poster));
    setMovies(withImageURL);
    setFilteredMovies(withImageURL);
  }, []);

  // Xử lý lọc và tìm kiếm
  useEffect(() => {
    let results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGenre) {
      results = results.filter((movie) =>
        movie.genre.includes(selectedGenre)
      );
    }

    if (selectedCity) {
      results = results.filter((movie) => movie.city === selectedCity);
    }

    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, selectedCity, movies]);

  return (
    <div className="movies-page-container bg-dark">
      {/* Banner tiêu đề */}
      <HeroBanner title="Movies" subtitle="Enjoy our latest films" />

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="movies-controls">
        <SearchBar
          placeholder="Search by title, actor, or director..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterPanel
          genres={["Action", "Romance", "Comedy", "Horror"]}
          cities={["Hanoi", "Ho Chi Minh", "Da Nang"]}
          selectedGenre={selectedGenre}
          selectedCity={selectedCity}
          onGenreChange={setSelectedGenre}
          onCityChange={setSelectedCity}
        />
      </div>

      {/* Danh sách phim */}
      <MovieCardList movies={filteredMovies} />

      {/* Ưu đãi đặc biệt */}
      <Offers />
    </div>
  );
}

export default Movies;
