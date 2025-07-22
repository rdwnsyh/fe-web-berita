export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://icbs.my.id";
export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/registerUser`,
  verify: `${API_BASE_URL}/api/auth/verify`, // tambahkan ini
  login: `${API_BASE_URL}/api/auth/login`, // tambahkan ini
};
