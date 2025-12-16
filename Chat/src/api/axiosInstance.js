import axios from 'axios';

// Get the backend URL from your Vercel environment variables
const API_BASE_URL = "https://neural-chat-prss.onrender.com";

const axiosInstance = axios.create({
  // LOGIC: Use the Env Var if it exists. If not, use localhost.
  baseURL: API_BASE_URL || 'http://localhost:5000', 
  
  withCredentials: true,
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