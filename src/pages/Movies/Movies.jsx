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
  const [banners, setBanners] = useState([
    // Bạn vẫn có thể giữ các banner mặc định
    { img: "banner1.jpg", title: "Banner 1" },
    { img: "banner2.jpg", title: "Banner 2" },
    { img: "banner3.jpg", title: "Banner 3" },
  ]);

  // Lấy query search từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchTerm(search);
  }, [location.search]);

  // ✅ Lấy dữ liệu từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/movies");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  // Lọc và tìm kiếm
  useEffect(() => {
    let results = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGenre) {
      results = results.filter((movie) =>
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    if (selectedCity) {
      results = results.filter((movie) => movie.city === selectedCity);
    }

    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, selectedCity, movies]);

  return (
    <div className="movies-page-container bg-dark text-light min-vh-100">
      <HeroBanner
        title="Now Showing"
        subtitle="Explore our movie collection"
        banners={banners}
      />

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

      <div className="movies-list container pb-5">
        <div className="row g-4">
          {filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="col-6 col-md-4 col-lg-3">
              <MovieCard
                movie={{
                  title: movie.title,
                  genre: movie.genres.map((g) => g.name).join(", "),
                  rating: movie.vote_average,
                  votes: movie.vote_count || 0, // nếu API có votes
                  img: movie.poster_path,
                  promoted: movie.promoted || false,
                  trailer_link: movie.trailer_link,
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
