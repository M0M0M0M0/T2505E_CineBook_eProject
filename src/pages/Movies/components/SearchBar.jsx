import React from 'react';
import './SearchBar.css';

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}

export default SearchBar;