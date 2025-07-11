import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Network Error";
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
    });
    return Promise.reject(errorMessage);
  }
);

export default api;
