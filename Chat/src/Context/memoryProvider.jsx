import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MemoryContext } from "./maincontext.jsx";
import { useAuth } from "./authContext.jsx"; // Adjust the path as needed
import axiosInstance from "../api/axiosInstance";

export const MemoryProvider = ({ children }) => {
  const { user } = useAuth();

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
        const response = await await axiosInstance.get(`/api/memory/v1`, {
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
        // Set memory to default even on error so UI still works
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
  }, [user]);

  const value = { memoryData, setMemoryData, isLoading, fetchError };

  return (
    <MemoryContext.Provider value={value}>
      {/* Error fallback UI so rest of the app doesn’t break */}
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
