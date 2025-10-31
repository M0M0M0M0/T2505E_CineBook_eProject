/**
 * Movies.jsx
 * Trang danh sách phim — gồm HeroBanner, SearchBar, FilterPanel, MovieCard.
 * Dữ liệu lấy từ src/components/utilities/constants.js
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import MovieCard from "./components/MovieCard";
import "./Movies.css";
// ✅ Import đúng kiểu named export (phù hợp với file constants.js)
import * as constants from "../../components/utilities/constants";


function Movies() {
  // ✅ Lấy dữ liệu từ constants
  const location = useLocation();
  const moviesData = constants.movies || [];
  const banners = constants.banners || [];

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ✅ Khi URL thay đổi, lấy query ?search=
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  setSearchTerm(search);
}, [location.search]);

  // ✅ Load dữ liệu phim
  useEffect(() => {
    setMovies(moviesData);
    setFilteredMovies(moviesData);
  }, [moviesData]);

  // ✅ Lọc và tìm kiếm
  useEffect(() => {
    let results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGenre) {
      results = results.filter((movie) =>
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // ⚠️ selectedCity không có trong constants.js — chỉ để tương lai
    if (selectedCity) {
      results = results.filter((movie) => movie.city === selectedCity);
    }

    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, selectedCity, movies]);

  return (
    <div className="movies-page-container bg-dark text-light min-vh-100">
      {/* Banner đầu trang */}
      <HeroBanner
        title="Now Showing"
        subtitle="Explore our movie collection"
        banners={banners}
      />

      {/* Thanh tìm kiếm + Bộ lọc */}
      <div className="movies-controls container my-4">
        <SearchBar
          placeholder="Search by movie title..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterPanel
          genres={[
            "Action",
            "Drama",
            "Fantasy",
            "Thriller",
            "Horror",
            "Comedy",
          ]}
          cities={["Hanoi", "Ho Chi Minh", "Da Nang"]}
          selectedGenre={selectedGenre}
          selectedCity={selectedCity}
          onGenreChange={setSelectedGenre}
          onCityChange={setSelectedCity}
        />
      </div>

      {/* Danh sách phim */}
      <div className="movies-list container pb-5">
        <div className="row g-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="col-6 col-md-4 col-lg-3">
              <MovieCard
                movie={{
                  title: movie.title,
                  genre: movie.genre,
                  rating: movie.rating,
                  votes: movie.votes,
                  img: movie.img,
                  promoted: movie.promoted,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Movies;
