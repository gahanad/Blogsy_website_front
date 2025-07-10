// src/utils/axiosConfig.js (or wherever you set up your Axios instance)
import axios from 'axios';
import authService from '@/services/authService'; // Adjust path if needed

const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const apiClient = axios.create({
  baseURL: `${base}/api`,// Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken(); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout(); // Clear token if unauthorized
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiClient;