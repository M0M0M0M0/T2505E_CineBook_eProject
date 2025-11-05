import api from "./axios";

// đăng ký
export const register = async (data) => {
  return await api.post("/register", data);
};

// đăng nhập
export const login = async (data) => {
  return await api.post("/login", data);
};

// quên mật khẩu
export const forgotPassword = async (data) => {
  return await api.post("/forgot-password", data);
};
