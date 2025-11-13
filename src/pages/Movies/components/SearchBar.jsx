// SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder, onSearchResults }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Đóng suggestions khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Unified search - tìm cả movie và cast
  useEffect(() => {
    if (value.trim().length >= 2) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        performUnifiedSearch(value);
      }, 500);

      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      if (onSearchResults) {
        onSearchResults(null);
      }
    }
  }, [value]);

  const performUnifiedSearch = async (query) => {
    setIsSearching(true);

    try {
      const [moviesResponse, castResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/movies"),
        fetch(
          `http://127.0.0.1:8000/api/movies/search-by-cac?query=${encodeURIComponent(
            query
          )}`
        ),
      ]);

      const allMovies = await moviesResponse.json();
      const castData = await castResponse.json();

      // Tìm movies theo title
      const moviesByTitle = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );

      // Tìm movies theo cast
      const moviesByCast = castData.movies || [];

      // Gộp kết quả và loại bỏ duplicate
      const allResults = [...moviesByTitle];
      const movieIds = new Set(moviesByTitle.map((m) => m.movie_id));

      moviesByCast.forEach((movie) => {
        if (!movieIds.has(movie.movie_id)) {
          allResults.push({
            ...movie,
            matchedByCast: true,
          });
          movieIds.add(movie.movie_id);
        }
      });

      // ✅ Giới hạn 5 suggestions cho dropdown
      const suggestions = allResults.slice(0, 20).map((movie) => ({
        id: movie.movie_id,
        title: movie.title,
        poster: movie.poster_path,
        matchedByCast: movie.matchedByCast || false,
        casts: movie.cacs || [],
      }));

      setSuggestions(suggestions);
      setShowSuggestions(true);

      // ✅ Trả về tất cả kết quả để hiển thị cards ở dưới
      if (onSearchResults) {
        onSearchResults(allResults);
      }
    } catch (error) {
      console.error("Unified search error:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (newValue) => {
    onChange(newValue);
  };

  const handleSelectSuggestion = (suggestion) => {
    window.location.href = `/movies/${suggestion.id}`;
  };

  const clearSearch = () => {
    onChange("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSearchResults) {
      onSearchResults(null);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      <div className="search-bar">
        {/* ✅ Bỏ icon kính lúp */}
        <input
          type="text"
          className="search-bar-input"
          placeholder={placeholder || "Search movies or cast/crew..."}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        {isSearching && (
          <span className="search-loading">
            <div className="spinner"></div>
          </span>
        )}

        {value && !isSearching && (
          <button className="search-clear-btn" onClick={clearSearch}>
            ✕
          </button>
        )}
      </div>

      {/* ✅ Suggestions dropdown - THU NHỎ */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.poster ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${suggestion.poster}`}
                  alt={suggestion.title}
                  className="suggestion-poster"
                />
              ) : (
                <div className="suggestion-poster-placeholder">🎬</div>
              )}

              <div className="suggestion-info">
                <div className="suggestion-title">{suggestion.title}</div>

                {suggestion.matchedByCast &&
                  suggestion.casts &&
                  suggestion.casts.length > 0 && (
                    <div className="suggestion-cast">
                      👤{" "}
                      {suggestion.casts
                        .slice(0, 2)
                        .map((c) => c.name)
                        .join(", ")}
                      {suggestion.casts.length > 2 && "..."}
                    </div>
                  )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions &&
        suggestions.length === 0 &&
        !isSearching &&
        value.length >= 2 && (
          <div className="search-no-results">
            No results found for "<strong>{value}</strong>"
          </div>
        )}
    </div>
  );
}

export default SearchBar;
