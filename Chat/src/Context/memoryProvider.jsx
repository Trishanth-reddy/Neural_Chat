import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { useAuth } from "./authContext.jsx";
import axiosInstance from "../api/axiosInstance";

// Create and export the context
export const MemoryContext = createContext(null);

export const MemoryProvider = ({ children }) => {
  // --- 1. GET THE LOADING STATE FROM AUTH ---
  const { user, isLoading: isAuthLoading } = useAuth();

  const [memoryData, setMemoryData] = useState({
    wyd: "",
    know: "",
    trait: "",
    pdfFile: null,
    pdfText: "",
    structuredData: null,
  });

  const [isLoading, setIsLoading] = useState(false); // This is MemoryProvider's own loading state
  const [fetchError, setFetchError] = useState(null);

  // --- 2. UPDATE THE useEffect HOOK ---
  useEffect(() => {
    // Wait for the auth check to finish
    if (isAuthLoading) {
      return; // Do nothing, still checking session
    }

    // Auth is finished, AND there is no user
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
      return; // Stop here
    }

    // --- If we get here, isAuthLoading is false AND user exists ---
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
        setFetchError(
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch memory data"
        );
        setMemoryData({
          wyd: "",
          know: "",
          trait: "",
          pdfFile: null,
          pdfText: "",
          structuredData: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoryData(); 
  }, [user, isAuthLoading]); // <-- 3. ADD isAuthLoading TO THE DEPENDENCY ARRAY

  const value = { memoryData, setMemoryData, isLoading, fetchError };

  return (
    <MemoryContext.Provider value={value}>
      {fetchError ? (
        <div className="w-full h-full flex items-center justify-center bg-black text-red-400 text-xl">
          Memory fetch failed: {fetchError}
        </div>
      ) : (
        children
      )}
    </MemoryContext.Provider>
  );
};