import axios from 'axios';

// Get the backend URL from your Vercel environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || 'https://neural-chat-prss.onrender.com', // Use env var, fallback to URL
  withCredentials: true, // <-- THIS IS CORRECT

  headers: {
    'Content-Type': 'application/json',
    // withCredentials: true, // <-- REMOVE THIS LINE. It's not a header.
  },
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // You can add toast notifications here
    return Promise.reject(error);
  }
);

export default axiosInstance;