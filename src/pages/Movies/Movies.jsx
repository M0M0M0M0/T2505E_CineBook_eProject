import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import MovieCard from "./components/MovieCard";
import "./Movies.css";

function Movies() {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const banners = [
    { img: "banner1.jpg", title: "Banner 1" },
    { img: "banner2.jpg", title: "Banner 2" },
    { img: "banner3.jpg", title: "Banner 3" },
  ];

  // 🔍 Lấy query từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  // ✅ Lấy dữ liệu từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies");
        const data = await res.json();

        const parsed = data.map((movie) => ({
          ...movie,
          cities: (() => {
            try {
              return JSON.parse(movie.cities);
            } catch {
              return [];
            }
          })(),
        }));

        // ✅ 20 phim mới nhất là Now Showing
        const nowShowing = parsed.slice(-20);
        setMovies(nowShowing);
        setFilteredMovies(nowShowing);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
    fetchMovies();
  }, []);

  // 🎯 Lọc
  useEffect(() => {
    let result = movies;

    if (searchTerm)
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedGenre)
      result = result.filter((m) =>
        m.genres.some((g) =>
          g.name.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );

    if (selectedCity)
      result = result.filter((m) => m.cities.includes(selectedCity));

    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, selectedCity, movies]);

  return (
    <div className="movies-page-container bg-dark text-light min-vh-100">
      <HeroBanner title="Now Showing" subtitle="Currently in cinemas" banners={banners} />

      <div className="movies-controls container my-4">
        <SearchBar
          placeholder="Search movies..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterPanel
          genres={["Action", "Drama", "Fantasy", "Thriller", "Horror", "Comedy"]}
          cities={["Hanoi", "Ho Chi Minh", "Da Nang"]}
          selectedGenre={selectedGenre}
          selectedCity={selectedCity}
          onGenreChange={setSelectedGenre}
          onCityChange={setSelectedCity}
        />
      </div>

      <div className="movies-list container pb-5">
        <div className="movie-grid-container">
          {filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="movie-grid-item">
              <MovieCard
                movie={{
                  title: movie.title,
                  genre: movie.genres.map((g) => g.name).join(", "),
                  rating: movie.vote_average,
                  votes: movie.vote_count || 0,
                  img: movie.poster_path,
                  trailer_link: movie.trailer_link,
                  movie_id: movie.movie_id,
                  overview: movie.overview,
                  cities: movie.cities,
                }}
              />
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p className="text-center text-secondary mt-4">
            No movies found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default Movies;
