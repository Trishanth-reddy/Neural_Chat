import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://neural-chat-prss.onrender.com/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
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