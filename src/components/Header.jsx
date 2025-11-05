// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);

  const mobileRef = useRef(null);
  const navigate = useNavigate();

  // Load user từ localStorage khi mount và lắng nghe event login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleLogin = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };

    window.addEventListener("login", handleLogin);

    return () => window.removeEventListener("login", handleLogin);
  }, []);

  // Đóng menu khi click ngoài
  useEffect(() => {
    function onDocClick(e) {
      if (
        mobileOpen &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [mobileOpen]);

  // Dropdown control
  let closeTimer = useRef(null);
  function handleOpenDropdown(name) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  }
  function handleCloseDropdownDelayed() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }
  function handleCancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  return (
    <header className="header-cb">
      <div className="header-cb-inner container">
        <div className="header-cb-left">
          <Link to="/" className="header-cb-logo" aria-label="CineBook Home">
            <div className="header-cb-logo-box">CineBook</div>
          </Link>
        </div>

        {/* ===== Main Nav ===== */}
        <nav className="header-cb-nav" aria-label="Main navigation">
          <ul className="header-cb-nav-list">
            {/* Movies dropdown */}
            <li
              className={`nav-item-cb nav-has-dropdown ${
                openDropdown === "movies" ? "open" : ""
              }`}
              onMouseEnter={() => handleOpenDropdown("movies")}
              onMouseLeave={handleCloseDropdownDelayed}
            >
              <button
                className="dropdown-toggle-cb"
                aria-haspopup="true"
                aria-expanded={openDropdown === "movies"}
                onClick={() =>
                  setOpenDropdown(openDropdown === "movies" ? null : "movies")
                }
              >
                <Link to="/movies" className="nav-link-cb">
                  Movies
                </Link>
              </button>
              <ul
                className="dropdown-menu-cb"
                onMouseEnter={handleCancelClose}
                onMouseLeave={handleCloseDropdownDelayed}
              >
                <li>
                  <Link to="/movies?filter=now" className="dropdown-link-cb">
                    Now Showing
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="dropdown-link-cb">
                    Coming Soon
                  </Link>
                </li>
              </ul>
            </li>

            {/* Theaters dropdown */}
            <li
              className={`nav-item-cb nav-has-dropdown ${
                openDropdown === "theaters" ? "open" : ""
              }`}
              onMouseEnter={() => handleOpenDropdown("theaters")}
              onMouseLeave={handleCloseDropdownDelayed}
            >
              <button
                className="dropdown-toggle-cb"
                aria-haspopup="true"
                aria-expanded={openDropdown === "theaters"}
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "theaters" ? null : "theaters"
                  )
                }
              >
                <Link to="/theaters" className="nav-link-cb">
                  Theaters
                </Link>
              </button>
              <ul
                className="dropdown-menu-cb"
                onMouseEnter={handleCancelClose}
                onMouseLeave={handleCloseDropdownDelayed}
              >
                <li>
                  <Link to="/theaters?city=Hanoi" className="dropdown-link-cb">
                    Ha Noi
                  </Link>
                </li>
                <li>
                  <Link to="/theaters?city=DaNang" className="dropdown-link-cb">
                    Da Nang
                  </Link>
                </li>
                <li>
                  <Link to="/theaters?city=HCM" className="dropdown-link-cb">
                    Ho Chi Minh
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item-cb">
              <Link to="/offers" className="nav-link-cb">
                News & Offers
              </Link>
            </li>

            <li className="nav-item-cb">
              <Link to="/profile" className="nav-link-cb">
                Profile
              </Link>
            </li>
            <li className="nav-item-cb">
              <Link to="/admin" className="nav-link-cb">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* ===== Right Actions ===== */}
        <div className="header-cb-actions">
          {/* Auth / User */}
          <div className="auth-links-cb">
            {user ? (
              <div className="user-info-cb">
                <span className="user-name-cb">{user.full_name}</span>
                <button className="logout-btn-cb" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="auth-link-cb">
                  Login
                </Link>
                <Link to="/register" className="auth-cta-cb">
                  Register
                </Link>
              </>
            )}
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

      {/* ===== Mobile Nav ===== */}
      <div
        className={`mobile-nav-cb ${mobileOpen ? "open" : ""}`}
        ref={mobileRef}
        aria-hidden={!mobileOpen}
      >
        <ul className="mobile-nav-list-cb">
          <li className="mobile-nav-item-cb">
            <Link to="/movies" onClick={() => setMobileOpen(false)}>
              Movies
            </Link>
          </li>
          <li className="mobile-nav-item-cb">
            <Link to="/theaters" onClick={() => setMobileOpen(false)}>
              Theaters
            </Link>
          </li>
          <li className="mobile-nav-item-cb">
            <Link to="/offers" onClick={() => setMobileOpen(false)}>
              News & Offers
            </Link>
          </li>
          <li className="mobile-nav-item-cb">
            {user ? (
              <div className="user-info-cb-mobile">
                <span>{user.full_name}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
