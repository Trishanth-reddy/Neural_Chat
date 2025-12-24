import axios from 'axios';

// 1. Force local URL as requested
const API_BASE_URL = 'https://neural-chat-prss.onrender.com/api'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Keep this if your backend expects cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add a REQUEST interceptor to attach the Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check localStorage for your token. 
    // NOTE: Verify if you stored it as 'token', 'accessToken', or something else.
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Keep your existing RESPONSE interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Auto-logout if token is expired (401)
    if (error.response && error.response.status === 401) {
        // console.log("Token expired, redirecting to login...");
        // localStorage.removeItem('token');
        // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;