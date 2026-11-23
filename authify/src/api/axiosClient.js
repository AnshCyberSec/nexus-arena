// src/api/axiosClient.js
import axios from 'axios';

// Base URL - Vite environment variable se aayega, fallback localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly Cookies (refresh token) ke liye zaroori hai
});

// 1. Request Interceptor: Har request mein access token attach karo
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Token expire hone par refresh token logic
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 (Unauthorized) aaya hai aur pehle retry nahi kiya hai
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;

      try {
        // Refresh token cookie ke through automatically chala jayega
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;