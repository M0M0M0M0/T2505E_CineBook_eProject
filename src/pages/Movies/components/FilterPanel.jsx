import React from "react";
import "./FilterPanel.css";

export default function FilterPanel({
  genres = [],
  cities = [],
  languages = [],
  selectedGenre,
  selectedCity,
  selectedLanguage,
  selectedRating,
  selectedDate,
  onGenreChange,
  onCityChange,
  onLanguageChange,
  onRatingChange,
  onDateChange,
  onClearFilters,
}) {
  return (
    <div className="filter-panel">
      {/* City Filter */}
      <select
        className="filter-select"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
      >
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Genre Filter */}
      <select
        className="filter-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {/* Language Filter */}
      <select
        className="filter-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      {/* Rating Filter */}
      <select
        className="filter-select"
        value={selectedRating}
        onChange={(e) => onRatingChange(e.target.value)}
      >
        <option value="">All Ratings</option>
        <option value="9">9+ ⭐</option>
        <option value="8">8+ ⭐</option>
        <option value="7">7+ ⭐</option>
        <option value="6">6+ ⭐</option>
        <option value="5">5+ ⭐</option>
      </select>

      {/* Date Filter */}
      <select
        className="filter-select"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      >
        <option value="">All Dates</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
        <option value="next-month">Next Month</option>
        <option value="this-year">This Year</option>
      </select>

      {/* Clear Filters Button */}
      <button className="clear-filters-btn" onClick={onClearFilters}>
        Clear All
      </button>
    </div>
  );
}
