import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/authContext.jsx';
import DarkVeil from '../../DarkVeil/DarkVeil';
import { Search, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useDebounce } from '../../hooks/useDebounce';

// Skeleton loader component
const HistorySkeleton = () => (
  <div className="grid gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
        <div className="h-4 bg-white/10 rounded w-full mb-2" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
      </div>
    ))}
  </div>
);

function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchUserHistory = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get(`/api/history/v1/${user._id}`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError(err.response?.data?.message || err.message || "Failed to load history");
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserHistory();
  }, [fetchUserHistory]);

  const filteredHistory = history.filter(item =>
    item.input.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.fulltext.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleRetry = () => {
    fetchUserHistory();
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
        <DarkVeil className="absolute inset-0 w-full h-full z-0" />
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />
        <div className="absolute inset-0 flex justify-center items-center z-10 p-4">
          <div className="flex flex-col h-[92vh] w-full max-w-6xl p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="flex flex-col items-center mb-8 flex-shrink-0">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chat History
              </h1>
            </div>
            <HistorySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
        <DarkVeil className="absolute inset-0 w-full h-full z-0" />
        <div className="absolute inset-0 flex justify-center items-center z-10 p-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load History</h2>
            <p className="text-white/60 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      <DarkVeil className="absolute inset-0 w-full h-full z-0" />
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />
      <div className="absolute inset-0 flex justify-center items-center z-10 p-4">
        <div className="flex flex-col h-[92vh] w-full max-w-6xl p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="flex flex-col items-center mb-8 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-8 h-8 text-violet-400" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chat History
              </h1>
            </div>
            <p className="text-white/60 text-center">Revisit your previous conversations</p>
          </div>

          <div className="relative mb-8 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white/15 transition-all duration-200 backdrop-blur-sm border border-white/10"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="grid gap-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => item.chatlink && navigate(item.chatlink)}
                    className="group relative cursor-pointer bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`, opacity: 0 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                          <h3 className="font-semibold text-white text-lg truncate group-hover:text-violet-300 transition-colors">
                            {item.input}
                          </h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-2">
                          {item.fulltext}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-white/50">
                          <Clock className="w-3 h-3" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-white/80 mb-2">No History Found</h3>
                  <p className="text-white/50">
                    {searchTerm ? 'No results match your search.' : 'Your previous conversations will appear here.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-thin::-webkit-scrollbar { width: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; }
      `}</style>
    </div>
  );
}

export default History;


