import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle non-standard responses
    if (response.data && typeof response.data.success !== "undefined") {
      if (!response.data.success) {
        const error = new Error(response.data.message || "Request failed");
        error.response = response;
        throw error;
      }
      return response.data;
    }
    return response.data;
  },
  (error) => {
    // Format error response
    const errorResponse = {
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };

    console.error("[API] Error Response:", errorResponse);

    // Create user-friendly message
    let userMessage = "Request failed";
    if (error.response) {
      if (error.response.data?.message) {
        userMessage = error.response.data.message;
      } else if (error.response.status === 500) {
        userMessage = "Server error occurred. Please try again later.";
      } else if (error.response.status === 404) {
        userMessage = "Resource not found";
      }
    } else if (error.message.includes("Network Error")) {
      userMessage = "Network connection failed";
    } else if (error.message.includes("timeout")) {
      userMessage = "Request timed out";
    }

    const formattedError = new Error(userMessage);
    formattedError.details = errorResponse;
    throw formattedError;
  }
);

export default api;
