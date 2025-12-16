import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/authContext.jsx';
import { MemoryContext } from '../../../Context/memoryProvider.jsx';
import DarkVeil from '../../../DarkVeil/DarkVeil';
import axios from 'axios';

const Chat = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [useMemory, setUseMemory] = useState(false);
    const { memoryData } = useContext(MemoryContext);
    const { user } = useAuth();
    const { chatId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        const fetchChatHistory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/v1/${chatId}`, {
                    withCredentials: true,
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                setMessages([{ role: 'assistant', content: 'Error: Could not load this chat.' }]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChatHistory();
    }, [chatId]); 

    const handleChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading || !user) return;

        setLoading(true);
        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");

        let finalPrompt = currentInput;
        if (useMemory) {
            const { wyd, know, trait, structuredData } = memoryData;
            const documentContext = structuredData
              ? `\n---\nADDITIONAL CONTEXT FROM UPLOADED DOCUMENT:\n${JSON.stringify(
                    structuredData, null, 2
                )}`
              : "";
    
            finalPrompt = `Based on the following information about me, please answer my question.
---
USER PROFILE:
- What I do: ${wyd || "Not specified."}
- Important things for you to know: ${know || "Not specified."}
- The traits you should adopt: ${trait || "Act as a helpful assistant."}
${documentContext}
---
My question is: ${currentInput}`;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/chat/v1/stream', {
                userId: user._id,
                chatId: chatId, 
                message: userMessage,
                fullPrompt: finalPrompt,
            }, {
                withCredentials: true,
            });

            const newChatData = response.data;
            setMessages(newChatData.messages);

            
            if (!chatId && newChatData._id) {
                navigate(`/chat/${newChatData._id}`, { replace: true });
            }

        } catch (err) {
            const errorMessage = {
                role: "assistant",
                content: `Error: ${err.response?.data?.message || err.message || "Unknown error"}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden font-sans">
            <DarkVeil className="absolute inset-0 w-full h-full z-0" />
            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />
            <div className="absolute inset-0 flex justify-center items-center z-10 p-3 sm:p-6">
                <div className="flex flex-col h-[95vh] w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-white/10 via-white/5 to-transparent border-b border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <h1 className="text-xl font-bold text-white/90 tracking-wide bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            Neural Chat
                        </h1>
                        <div className="w-6 h-6" />
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className={`group relative max-w-[85%] sm:max-w-[75%] px-6 py-4 rounded-3xl shadow-xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${msg.role === 'user' ? 'bg-gradient-to-br from-violet-600/80 via-purple-600/60 to-violet-600/40 border-violet-500/30 text-white ml-4' : 'bg-gradient-to-br from-white/15 via-white/10 to-white/5 border-white/20 text-white/95 mr-4'}`}>
                                    <div className={`absolute -top-2 ${msg.role === 'user' ? '-right-2' : '-left-2'} w-9 h-9 rounded-full ${msg.role === 'user' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                                        {msg.role === 'user' ? 'U' : 'AI'}
                                    </div>
                                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${msg.role === 'user' ? 'shadow-[0_0_30px_rgba(139,69,198,0.3)]' : 'shadow-[0_0_30px_rgba(255,255,255,0.1)]'}`} />
                                    <div className="relative z-10 whitespace-pre-wrap break-words font-medium leading-relaxed text-sm sm:text-base">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-fade-in-up">
                                <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 border-white/20 border backdrop-blur-xl px-6 py-4 rounded-3xl mr-4 shadow-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                        <span className="text-white/70 text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- MEMORY TOGGLE (NOW FUNCTIONAL) --- */}
                    <div className="flex items-center justify-center py-4 bg-gradient-to-r from-white/5 to-transparent border-t border-white/10">
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className="relative w-14 h-7">
      <input
        type="checkbox"
        id="useMemory"
        checked={useMemory}
        onChange={(e) => setUseMemory(e.target.checked)}
        className="sr-only peer"
      />
      {/* Track */}
      <div className="absolute inset-0 w-full h-full rounded-full transition-all duration-300 
        peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-purple-500 
        peer-checked:shadow-[0_0_20px_rgba(139,69,198,0.5)] bg-white/20 border border-white/30" 
      />
      {/* Thumb */}
      <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg 
        transition-all duration-300 transform peer-checked:translate-x-7" 
      />
    </div>
    <span
      className="text-base font-medium group-hover:text-white transition-colors text-white/80 peer-checked:text-white"
    >
      Memory Enhancement
    </span>
  </label>
</div>
                        

                    <div className="p-4 sm:p-6 bg-gradient-to-r from-white/10 to-white/5 border-t border-white/10">
                        <div className="relative flex items-end space-x-4 p-3 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-xl">
                            <textarea value={input} onChange={handleChange} onKeyDown={handleKeyDown} disabled={loading} placeholder="Share your thoughts..." className="w-full bg-transparent text-white placeholder-white/50 resize-none outline-none py-3 px-4 rounded-xl font-medium leading-relaxed min-h-[44px] max-h-32 focus:ring-2 focus:ring-violet-500/50" rows={1} />
                            <button type="button" onClick={handleSubmit} disabled={loading || !input.trim()} className={`relative overflow-hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform ${loading || !input.trim() ? 'bg-white/10 cursor-not-allowed' : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-purple-500 hover:to-violet-500 hover:scale-110 hover:shadow-[0_0_25px_rgba(139,69,198,0.6)] active:scale-95'}`} aria-label="Send message">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 text-white relative z-10 transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-0.5'}`}>
                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom Styles */}
            <style jsx>{`
            /* General animation for messages appearing */
                @keyframes fade-in-up {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                .animate-fade-in-up {
                  animation: fade-in-up 0.6s ease-out forwards;
                }

                /* Custom scrollbar styles */
                .scrollbar-thin {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
                }
                .scrollbar-thin::-webkit-scrollbar {
                  width: 8px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                  background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                  background-color: rgba(255, 255, 255, 0.2);
                  border-radius: 20px;
                  border: 3px solid transparent;
                  background-clip: content-box;
                }

                /* Since Tailwind's peer-checked variant handles the toggle animation, 
                   no extra CSS is needed for the toggle itself. */
                
            `}</style>
        </div>
    );
};

export default Chat;




