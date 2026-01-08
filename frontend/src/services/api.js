import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},

(error) => {
  console.log("Request error:", error);
  return Promise.reject(error);
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response, // Success handler - just pass through
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page (prevent redirect loop)
      const loginUrl = "/login";
      if (!window.location.pathname.includes(loginUrl)) {
        // Save the current path to redirect back after login
        const redirectPath = window.location.pathname + window.location.search;
        window.location.href = `${loginUrl}?redirect=${encodeURIComponent(redirectPath)}`;
      }
    }

    // Log other errors for debugging
    if (error.response?.status !== 401) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;