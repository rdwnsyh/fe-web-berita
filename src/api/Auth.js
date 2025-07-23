export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://icbs.my.id";

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/registerUser`,
  login: `${API_BASE_URL}/api/auth/login`,
  verify: `${API_BASE_URL}/api/auth/verify`, // Verifikasi OTP
  resend: `${API_BASE_URL}/api/auth/resend`, // Kirim ulang OTP
  checkOtpExpiry: `${API_BASE_URL}/api/auth/check-expiry`, // Cek waktu kadaluarsa OTP
};
