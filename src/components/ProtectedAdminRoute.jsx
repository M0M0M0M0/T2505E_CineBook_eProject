import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin =
    user?.user_type === "staff" && ["ADMIN", "MANAGER"].includes(user?.role_id);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
