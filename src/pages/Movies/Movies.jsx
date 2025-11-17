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

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
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

  // Languages 
useEffect(() => {
  setLanguages([
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "hi", name: "Hindi" },
    { code: "ml", name: "Malayalam" },
    { code: "no", name: "Norwegian" },
    { code: "pl", name: "Polish" },
    { code: "th", name: "Thai" },
    { code: "tl", name: "Tagalog" },
    { code: "ja", name: "Japanese" },
  ]);
}, []);


  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies");
        const data = await res.json();
        const parsed = data.map(formatMovieData);

        const nowShowing = parsed.slice(-20);
        setMovies(nowShowing);
        setFilteredMovies(nowShowing);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
    fetchMovies();
  }, []);

  // FILTER LOGIC 
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

    //  Language filter
    if (selectedLanguage) {
      result = result.filter(
        (m) => m.original_language?.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    //  Rating filter
    if (selectedRating) {
      result = result.filter((m) => m.vote_average >= Number(selectedRating));
    }

    //  Date filter
    if (selectedDate) {
      const now = new Date();
      result = result.filter((m) => {
        const release = new Date(m.release_date);
        switch (selectedDate) {
          case "this-week":
            const weekStart = new Date();
            weekStart.setDate(now.getDate() - 7);
            return release >= weekStart && release <= now;
          case "this-month":
            return (
              release.getMonth() === now.getMonth() &&
              release.getFullYear() === now.getFullYear()
            );
          case "next-month":
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);
            return (
              release.getMonth() === nextMonth.getMonth() &&
              release.getFullYear() === nextMonth.getFullYear()
            );
          case "this-year":
            return release.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredMovies(result);
  }, [
    searchTerm,
    selectedGenre,
    selectedCity,
    selectedLanguage,
    selectedRating,
    selectedDate,
    movies,
  ]);

  //  Clear All
  const handleClearFilters = () => {
    setSelectedGenre("");
    setSelectedCity("");
    setSelectedLanguage("");
    setSelectedRating("");
    setSelectedDate("");
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
        />
        <FilterPanel
          genres={genres.map((g) => g.name)}
          cities={cities}
          languages={languages}
          selectedGenre={selectedGenre}
          selectedCity={selectedCity}
          selectedLanguage={selectedLanguage}
          selectedRating={selectedRating}
          selectedDate={selectedDate}
          onGenreChange={setSelectedGenre}
          onCityChange={setSelectedCity}
          onLanguageChange={setSelectedLanguage}
          onRatingChange={setSelectedRating}
          onDateChange={setSelectedDate}
          onClearFilters={handleClearFilters}
          isLoadingGenres={isLoadingGenres}
          isLoadingCities={isLoadingCities}
        />
      </div>

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
