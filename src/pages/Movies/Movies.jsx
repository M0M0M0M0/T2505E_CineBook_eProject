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
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  const banners = [
    { img: "banner1.jpg", title: "Banner 1" },
    { img: "banner2.jpg", title: "Banner 2" },
    { img: "banner3.jpg", title: "Banner 3" },
  ];

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/genres");
        const data = await res.json();
        setGenres(data);
      } catch (e) {
        console.error("Error fetching genres:", e);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/cities");
        const data = await res.json();
        setCities(data);
      } catch (e) {
        console.error("Error fetching cities:", e);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  // Format movie data
  const formatMovieData = (movie) => ({
    ...movie,
    genres: movie.genres || [],
    cities: (() => {
      try {
        return movie.cities ? JSON.parse(movie.cities) : [];
      } catch {
        return [];
      }
    })(),
  });

  // Fetch movies - Now Showing only (20 phim mới nhất)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies");
        const data = await res.json();
        const parsed = data.map(formatMovieData);

        // ✅ Chỉ lấy 20 phim mới nhất (Now Showing)
        const nowShowing = parsed.slice(-20);
        setMovies(nowShowing);
        setFilteredMovies(nowShowing);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Filter logic - chỉ search trong movies của Now Showing
  useEffect(() => {
    let result = movies;

    if (searchTerm && searchTerm.trim().length >= 2) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      result = result.filter((m) =>
        m.genres.some((g) =>
          g.name.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );
    }

    if (selectedCity) {
      result = result.filter((m) => m.cities.includes(selectedCity));
    }

    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, selectedCity, movies]);

  // ✅ Handle search results from SearchBar (chỉ lấy movies trong Now Showing)
  const handleSearchResults = (searchResults) => {
    if (searchResults === null) {
      // Reset
      setFilteredMovies(movies);
    } else if (searchResults.length === 0) {
      setFilteredMovies([]);
    } else {
      // ✅ Chỉ lấy movies có trong danh sách Now Showing
      const nowShowingIds = new Set(movies.map((m) => m.movie_id));
      const filtered = searchResults
        .filter((movie) => nowShowingIds.has(movie.movie_id))
        .map(formatMovieData);

      setFilteredMovies(filtered);
    }
  };

  return (
    <div className="movies-page-container bg-dark text-light min-vh-100">
      <HeroBanner
        title="Now Showing"
        subtitle="Currently in cinemas"
        banners={banners}
      />

      <div className="movies-controls container my-4">
        <SearchBar
          placeholder="Search now showing movies or cast..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearchResults={handleSearchResults}
        />
        <FilterPanel
          genres={genres.map((g) => g.name)}
          cities={cities}
          selectedGenre={selectedGenre}
          selectedCity={selectedCity}
          onGenreChange={setSelectedGenre}
          onCityChange={setSelectedCity}
          isLoadingGenres={isLoadingGenres}
          isLoadingCities={isLoadingCities}
        />
      </div>

      {/* ✅ Hiển thị số lượng kết quả khi search */}
      {searchTerm && searchTerm.trim().length >= 2 && (
        <div className="container mb-3">
          <p className="text-secondary">
            Found{" "}
            <strong className="text-warning">{filteredMovies.length}</strong>{" "}
            result{filteredMovies.length !== 1 ? "s" : ""} for "{searchTerm}" in
            Now Showing
          </p>
        </div>
      )}

      <div className="movies-list container pb-5">
        <div className="movie-grid-container">
          {filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="movie-grid-item">
              <MovieCard
                movie={{
                  title: movie.title,
                  genre: (movie.genres || []).map((g) => g.name).join(", "),
                  rating: movie.vote_average,
                  votes: movie.vote_count || 0,
                  img: movie.poster_path,
                  trailer_link: movie.trailer_link,
                  movie_id: movie.movie_id,
                  overview: movie.overview,
                  cities: movie.cities || [],
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
