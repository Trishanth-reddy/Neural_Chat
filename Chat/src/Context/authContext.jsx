import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try { const { data } = await axiosInstance.get('/api/auth/v1/me'); setUser(data); }
      catch { setUser(null); }
      finally { setIsLoading(false); }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/auth/v1/login', { email, password });
      setUser(data);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/auth/v1/signup', { username, email, password });
      setUser(data);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await axiosInstance.post('/api/auth/v1/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
