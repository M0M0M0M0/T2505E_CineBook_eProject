import React from 'react';
import './FilterPanel.css';

function FilterPanel({
  genres, cities, selectedGenre, selectedCity,
  onGenreChange, onCityChange
}) {
  return (
    <div className="filter-panel">
      <select
        className="filter-panel-select"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
      >
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <select
        className="filter-panel-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>

      {/* Có thể thêm bộ lọc khác (language, rating, date) tương tự */}
    </div>
  );
}

export default FilterPanel;