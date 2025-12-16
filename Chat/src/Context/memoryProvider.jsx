import React, { useState, useEffect, createContext, useRef } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from './authContext.jsx';

export const MemoryContext = createContext(null);

export const MemoryProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Use a ref to track if we have already fetched for this user session
  // This helps prevents double-fetching in React Strict Mode
  const hasFetched = useRef(false);
  const lastUserId = useRef(null);

  const [memoryData, setMemoryData] = useState({
    wyd: "",
    know: "",
    trait: "",
    pdfFile: null,
    pdfText: "",
    structuredData: null,
    pdfFilename: null, // Ensure this field exists for UI sync
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // 1. If Auth is still loading, do nothing yet
    if (isAuthLoading) return;

    // 2. If no user, reset memory and mark as "fetched" for this anonymous state
    if (!user) {
      setMemoryData({
        wyd: "",
        know: "",
        trait: "",
        pdfFile: null,
        pdfText: "",
        structuredData: null,
        pdfFilename: null
      });
      setFetchError(null);
      hasFetched.current = true;
      lastUserId.current = null;
      return;
    }

    // 3. Reset fetch flag if the user ID has changed (e.g. logout -> login different user)
    if (user._id !== lastUserId.current) {
      hasFetched.current = false;
      lastUserId.current = user._id;
    }

    // 4. Fetch Logic
    const fetchMemoryData = async () => {
      // Prevent fetching if we already did for this user
      if (hasFetched.current) return;

      setIsLoading(true);
      setFetchError(null);
      
      try {
        const response = await axiosInstance.get(`/api/memory/v1`, {
          withCredentials: true,
        });

        // Only update if we got data back
        if (response.data) {
          setMemoryData(prevData => ({
            ...prevData,
            ...response.data,
            // Ensure pdfFile object structure exists if filename exists
            pdfFile: response.data.pdfFilename ? { name: response.data.pdfFilename } : null
          }));
        }
        
        hasFetched.current = true; // Mark success
      } catch (error) {
        // Handle 404 (New User) separate from actual errors
        if (error.response?.status === 404) {
          console.log("No existing memory found (New User).");
          hasFetched.current = true; // Mark as fetched so we don't retry locally
        } else {
          console.error("Error fetching memory:", error);
          setFetchError(
            error.response?.data?.message || 
            error.message || 
            "Failed to load memory settings."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoryData();

  }, [user, isAuthLoading]);

  // Context value
  const value = { 
    memoryData, 
    setMemoryData, 
    isLoading: isLoading || isAuthLoading, 
    fetchError 
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
};