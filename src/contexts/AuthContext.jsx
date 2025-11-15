import React, { createContext, useState, useEffect, useContext } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };


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


  const currentUserId = user ? user.web_user_id : null;

  const contextValue = {
    user,
    isAuthenticated: !!user,
    currentUserId, 
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
