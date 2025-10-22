
import React, { useState, useEffect, createContext } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from './authContext.jsx';



export const MemoryContext = createContext(null);
export const MemoryProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [memoryData, setMemoryData] = useState({
    wyd: "",
    know: "",
    trait: "",
    pdfFile: null,
    pdfText: "",
    structuredData: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      setMemoryData({
        wyd: "",
        know: "",
        trait: "",
        pdfFile: null,
        pdfText: "",
        structuredData: null,
      });
      setFetchError(null);
      return;
    }

    const fetchMemoryData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await axiosInstance.get(`/api/memory/v1`, {
          withCredentials: true,
        });
        setMemoryData(prevData => ({
          ...prevData,
          ...response.data,
        }));
      } catch (error) {
        // Don't treat 404 as error for new users
        if (error.response?.status === 404) {
          console.log("No memory data found - new user");
          setFetchError(null);
        } else {
          console.error("Error fetching memory:", error);
          setFetchError(
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch memory data"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoryData();
  }, [user, isAuthLoading]);

  // ALWAYS provide a value object, never null
  const value = { 
    memoryData, 
    setMemoryData, 
    isLoading: isLoading || isAuthLoading, // Combine both loading states
    fetchError 
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
};
