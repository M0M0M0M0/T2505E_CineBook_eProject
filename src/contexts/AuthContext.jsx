import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  // Lấy user từ localStorage khi khởi tạo
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Hàm xử lý Đăng nhập (nếu cần dùng trực tiếp)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm xử lý Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Nghe event 'login' (được dispatch trong Login.jsx)
  useEffect(() => {
    const handleLoginEvent = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("login", handleLoginEvent);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
    };
  }, []);

  // ✅ LẤY ID CHÍNH XÁC: web_user_id
  const currentUserId = user ? user.web_user_id : null;

  // Giá trị sẽ được cung cấp cho các component con
  const contextValue = {
    user,
    isAuthenticated: !!user,
    currentUserId, // ⬅️ Cung cấp ID chính xác
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom Hook tiện ích
export const useAuth = () => useContext(AuthContext);
