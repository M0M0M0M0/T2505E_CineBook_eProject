// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const mobileRef = useRef(null);
  const navigate = useNavigate();

  // Load user from localStorage and watch for login event
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAdmin(userData.user_type === "staff");
    }

    const handleLogin = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        const userData = JSON.parse(updatedUser);
        setUser(userData);
        setIsAdmin(userData.user_type === "staff");
      }
    };

    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  // Close mobile nav when clicking outside
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

  // ✅ Function để đánh dấu tất cả là đã đọc
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://127.0.0.1:8000/api/notifications/mark-all-read",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.ok) {
        // Cập nhật state: đánh dấu tất cả là đã đọc
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // ✅ Function để đánh dấu 1 thông báo là đã đọc
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://127.0.0.1:8000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Cập nhật state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Fetch notifications (for USER only)
  useEffect(() => {
    if (!user || user.user_type !== "customer") return;

    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
        else console.warn("Unexpected notification data:", data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [user]);

  // Auto-fetch notifications every 30 seconds
  useEffect(() => {
    if (!user || user.user_type !== "customer") return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/notifications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data || []);
      } catch (err) {
        console.error("Notification fetch failed:", err);
      }
    };

    fetchNotifications(); // initial load
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  // ✅ Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
                  <Link
                    to="/theaters?region=Hanoi"
                    className="dropdown-link-cb"
                  >
                    Ha Noi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/theaters?region=Da+Nang"
                    className="dropdown-link-cb"
                  >
                    Da Nang
                  </Link>
                </li>
                <li>
                  <Link
                    to="/theaters?region=Ho+Chi+Minh+City"
                    className="dropdown-link-cb"
                  >
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
                Profile & Tickets
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item-cb">
                <Link to="/admin" className="nav-link-cb">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* ===== Right Actions ===== */}
        <div className="header-cb-actions">
          {/* Notification bell for USER role */}
          {user && user.user_type === "customer" && (
            <div className="position-relative me-3">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                Notify
                {/* ✅ Hiển thị badge CHỈ KHI có thông báo chưa đọc */}
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-14px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      color: "white",
                      fontSize: "0.65rem",
                      padding: "2px 6px",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu show p-2"
                  style={{
                    right: 0,
                    left: "auto",
                    minWidth: "320px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    backgroundColor: "#222",
                    color: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    position: "absolute",
                    top: "120%",
                    zIndex: 9999,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    <h6 className="text-white mb-0">Notifications</h6>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        style={{
                          background: "none",
                          border: "1px solid #555",
                          color: "#aaa",
                          fontSize: "0.75rem",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="text-center text-muted small py-3">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.notification_id}
                        onClick={() => {
                          if (!n.is_read) {
                            markAsRead(n.notification_id);
                          }
                        }}
                        style={{
                          padding: "10px",
                          marginBottom: "6px",
                          borderRadius: "6px",
                          cursor: n.is_read ? "default" : "pointer",
                          // ✅ Style khác nhau cho đã đọc/chưa đọc
                          backgroundColor: n.is_read ? "#2a2a2a" : "#3a3a3a",
                          borderLeft: n.is_read
                            ? "3px solid transparent"
                            : "3px solid #f39c12",
                          opacity: n.is_read ? 0.6 : 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: n.is_read ? "#aaa" : "white",
                            fontWeight: n.is_read ? "normal" : "500",
                          }}
                        >
                          {n.message}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "#888",
                            marginTop: "4px",
                          }}
                        >
                          {new Date(n.created_at).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

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
