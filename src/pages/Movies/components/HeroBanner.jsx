import React from "react";
import "./../../Movies/Movies.css";

export default function HeroBanner({ title, subtitle }) {
  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(${new URL("../../../assets/images/herobanner-sky1.jpg", import.meta.url).href})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
