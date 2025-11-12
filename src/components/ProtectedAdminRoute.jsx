import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Kiểm tra xem user có phải admin không
  const isAdmin =
    user?.user_type === "staff" && ["ADMIN", "MANAGER"].includes(user?.role_id);

  if (!user) {
    // Chưa đăng nhập -> redirect về login
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Không phải admin -> redirect về home
    return <Navigate to="/" replace />;
  }

  // Là admin -> cho vào
  return children;
}
