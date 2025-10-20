// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // dropdown state: null | 'movies' | 'theaters'
  const [openDropdown, setOpenDropdown] = useState(null);

  const searchRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [searchOpen, mobileOpen]);

  // Handlers to open/close dropdowns with small delay tolerance
  let closeTimer = useRef(null);
  function handleOpenDropdown(name) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(name);
  }
  function handleCloseDropdownDelayed() {
    // small delay to allow pointer to move into menu
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }
  function handleCancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  return (
    <header className="header-cb">
      <div className="header-cb-inner container">
        <div className="header-cb-left">
          <Link to="/" className="header-cb-logo" aria-label="CineBook Home">
            <div className="header-cb-logo-box">CineBook</div>
          </Link>
        </div>

        <nav className="header-cb-nav" aria-label="Main navigation">
          <ul className="header-cb-nav-list">
            {/* Movies dropdown */}
            <li
              className={`nav-item-cb nav-has-dropdown ${openDropdown === "movies" ? "open" : ""}`}
              onMouseEnter={() => handleOpenDropdown("movies")}
              onMouseLeave={() => handleCloseDropdownDelayed()}
            >
              <button 
                className="dropdown-toggle-cb"
                aria-haspopup="true"
                aria-expanded={openDropdown === "movies"}
                onClick={() => setOpenDropdown(openDropdown === "movies" ? null : "movies")}
              >
                <Link to="/movies" className="nav-link-cb">Movies</Link>
              </button>

              <ul
                className="dropdown-menu-cb"
                onMouseEnter={handleCancelClose}
                onMouseLeave={handleCloseDropdownDelayed}
              >
                <li><Link to="/movies?filter=now" className="dropdown-link-cb">Now Showing</Link></li>
                <li><Link to="/movies?filter=coming" className="dropdown-link-cb">Coming Soon</Link></li>
              </ul>
            </li>

            {/* Theaters dropdown */}
            <li
              className={`nav-item-cb nav-has-dropdown ${openDropdown === "theaters" ? "open" : ""}`}
              onMouseEnter={() => handleOpenDropdown("theaters")}
              onMouseLeave={() => handleCloseDropdownDelayed()}
            >
              <button
                className="dropdown-toggle-cb"
                aria-haspopup="true"
                aria-expanded={openDropdown === "theaters"}
                onClick={() => setOpenDropdown(openDropdown === "theaters" ? null : "theaters")}
              >
                Theaters
              </button>

              <ul
                className="dropdown-menu-cb"
                onMouseEnter={handleCancelClose}
                onMouseLeave={handleCloseDropdownDelayed}
              >
                <li><Link to="/theaters?city=Hanoi" className="dropdown-link-cb">Ha Noi</Link></li>
                <li><Link to="/theaters?city=DaNang" className="dropdown-link-cb">Da Nang</Link></li>
                <li><Link to="/theaters?city=HCM" className="dropdown-link-cb">Ho Chi Minh</Link></li>
              </ul>
            </li>

            <li className="nav-item-cb"><Link to="/offers" className="nav-link-cb">News & Offers</Link></li>
            <li className="nav-item-cb"><Link to="/my-tickets" className="nav-link-cb">My Tickets</Link></li>
            <li className="nav-item-cb"><Link to="/about" className="nav-link-cb">About</Link></li>
            <li className="nav-item-cb"><Link to="/admin" className="nav-link-cb">Admin Dashboard</Link></li>
          </ul>
        </nav>

        <div className="header-cb-actions">
          <div className="search-wrapper-cb" ref={searchRef}>
            <button
              className="search-toggle-cb"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            {searchOpen && (
              <div className="search-box-cb" role="search">
                <input type="search" placeholder="Search title, actor, director..." className="search-input-cb" autoFocus />
              </div>
            )}
          </div>

          <div className="auth-links-cb">
            <Link to="/login" className="auth-link-cb">Login</Link>
            <Link to="/register" className="auth-cta-cb">Register</Link>
          </div>

          <button
            className={`hamburger-cb ${mobileOpen ? "is-open" : ""}`}
            aria-label="Open menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-nav-cb ${mobileOpen ? "open" : ""}`} ref={mobileRef} aria-hidden={!mobileOpen}>
        <ul className="mobile-nav-list-cb">
          <li className="mobile-nav-item-cb"><Link to="/movies" onClick={() => setMobileOpen(false)}>Movies</Link></li>
          <li className="mobile-nav-item-cb"><Link to="/theaters" onClick={() => setMobileOpen(false)}>Theaters</Link></li>
          <li className="mobile-nav-item-cb"><Link to="/news" onClick={() => setMobileOpen(false)}>News & Offers</Link></li>
          <li className="mobile-nav-item-cb"><Link to="/my-tickets" onClick={() => setMobileOpen(false)}>My Tickets</Link></li>
          <li className="mobile-nav-item-cb"><Link to="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
          <li className="mobile-nav-item-cb auth-mobile-cb">
            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
