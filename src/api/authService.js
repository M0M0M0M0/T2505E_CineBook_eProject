import api from "./axios";

// register
export const register = async (data) => {
  return await api.post("/register", data);
};

// login
export const login = async (data) => {
  return await api.post("/login", data);
};

// forgotPassword
export const forgotPassword = async (data) => {
  return await api.post("/forgot-password", data);
};
