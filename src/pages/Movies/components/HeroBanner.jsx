import React from 'react';
import './HeroBanner.css';

function HeroBanner({ title, subtitle }) {
  return (
    <div className="hero-banner">
      {/* Ảnh nền của banner (có thể dùng CSS hoặc thẻ img) */}
      <div className="hero-banner-bg" />
      <div className="hero-banner-content">
        <h1 className="hero-banner-title">{title}</h1>
        <p className="hero-banner-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default HeroBanner;