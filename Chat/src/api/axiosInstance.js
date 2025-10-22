import axios from 'axios';

// Get the backend URL from your Vercel environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || 'https://neural-chat-prss.onrender.com', // Use env var, fallback to URL
  withCredentials: true, // <-- THIS IS CORRECT

  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;