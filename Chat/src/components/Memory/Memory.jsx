import React, { Suspense, lazy, useState, useEffect, useContext } from 'react';
import { MemoryContext } from '../../Context/MemoryProvider.jsx';
import { Bot, FileText, UploadCloud, Trash2, Save, Brain, Zap, Shield } from 'lucide-react';
import DarkVeil from '../../DarkVeil/DarkVeil.jsx';
import axiosInstance from '../../api/axiosInstance.js';

function Memory() {
    // ============ ALL HOOKS AT THE TOP ============
    const context = useContext(MemoryContext);
    const [localPdfFilename, setLocalPdfFilename] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // ============ CONDITIONAL CHECKS AFTER HOOKS ============
    if (!context) {
        return (
            <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex items-center justify-center">
                <div className="text-center">
                    <Brain className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl text-white/80">Initializing memory system...</p>
                </div>
            </div>
        );
    }

    const { memoryData, setMemoryData, isLoading: contextLoading } = context;
    const { wyd, know, trait, structuredData } = memoryData;

    // Show loading screen while initial data is loading
    if (contextLoading) {
        return (
            <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex items-center justify-center">
                <DarkVeil className="absolute inset-0 w-full h-full z-0" />
                <div className="text-center z-10">
                    <Brain className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl text-white/80">Loading your memory data...</p>
                </div>
            </div>
        );
    }

    // ============ ALL OTHER HOOKS AFTER CONTEXT CHECK ============
    // Fetch existing memory data when the component mounts
    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const response = await axiosInstance.get('/api/memory/v1/');
                
                if (response.data) {
                    setMemoryData(prev => ({
                        ...prev,
                        wyd: response.data.wyd || '',
                        know: response.data.know || '',
                        trait: response.data.trait || '',
                        structuredData: response.data.structuredData || null,
                        pdfFile: response.data.pdfFilename ? { name: response.data.pdfFilename } : null,
                    }));
                    setLocalPdfFilename(response.data.pdfFilename || '');
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Error fetching memory:", error);
                }
            }
        };
        fetchMemory();
    }, [setMemoryData]);

    // ============ EVENT HANDLERS ============
    const handleInputChange = (field) => (e) => {
        setMemoryData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handlePdfChange = async e => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const form = new FormData();
            form.append("pdf", file);
            
            const { data } = await axiosInstance.post(
                "/api/memory/v1/processPdf",
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            
            setMemoryData(prev => ({
                ...prev,
                structuredData: data.structuredData
            }));

            setLocalPdfFilename(file.name);

        } catch (err) {
            console.error("Error processing PDF:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearPdf = () => {
        setMemoryData(prev => ({ ...prev, structuredData: null, pdfFile: null }));
        setLocalPdfFilename('');
    };

    const handleSaveChanges = async () => {
        setSaveStatus('Saving...');
        try {
            const payload = {
                wyd,
                know,
                trait,
                structuredData,
                pdfFilename: localPdfFilename || null
            };
            
            await axiosInstance.post(
                '/api/memory/v1/saveMemory',
                payload
            );
            
            setSaveStatus('Saved successfully!');
        } catch (err) {
            console.error("Failed to save memory:", err);
            setSaveStatus('Failed to save.');
        } finally {
            setTimeout(() => setSaveStatus(''), 2000);
        }
    };

    // ============ MAIN RENDER ============
    return (
        <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
            <DarkVeil className="absolute inset-0 w-full h-full z-0" />
            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />

            <div className="absolute inset-0 flex justify-center items-center z-10 p-4">
                <div className="flex flex-col max-h-[95vh] w-full max-w-7xl p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 flex-shrink-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <Brain className="w-8 h-8 text-violet-400" />
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AI Memory Configuration
                            </h1>
                        </div>
                        <p className="text-white/60 text-center">Personalize your AI assistant with custom memory settings</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">

                        {/* Left Column - AI Personality */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">AI Personality Settings</h3>
                            </div>

                            <div className="space-y-6 flex-grow flex flex-col">
                                {/* Role Input */}
                                <div className="space-y-2">
                                    <label htmlFor="wyd" className="flex items-center space-x-2 text-sm font-medium text-white/80">
                                        <Shield className="w-4 h-4 text-violet-400" />
                                        <span>What is your role or profession?</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="wyd"
                                        value={wyd}
                                        onChange={handleInputChange('wyd')}
                                        placeholder="e.g., Software Developer"
                                        className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/50 rounded-xl p-3 border border-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-200"
                                    />
                                </div>

                                {/* Key Information */}
                                <div className="flex-grow flex flex-col space-y-2">
                                    <label htmlFor="know" className="flex items-center space-x-2 text-sm font-medium text-white/80">
                                        <Zap className="w-4 h-4 text-violet-400" />
                                        <span>What key information should the AI know about you?</span>
                                    </label>
                                    <textarea
                                        id="know"
                                        value={know}
                                        onChange={handleInputChange('know')}
                                        rows={6}
                                        placeholder="e.g., I work with React and Node.js, interested in AI."
                                        className="w-full flex-grow bg-white/10 backdrop-blur-sm text-white placeholder-white/50 rounded-xl p-3 border border-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none resize-none transition-all duration-200"
                                    />
                                </div>

                                {/* Traits Input */}
                                <div className="space-y-2">
                                    <label htmlFor="trait" className="flex items-center space-x-2 text-sm font-medium text-white/80">
                                        <Brain className="w-4 h-4 text-violet-400" />
                                        <span>What traits should the AI have?</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="trait"
                                        value={trait}
                                        onChange={handleInputChange('trait')}
                                        placeholder="e.g., Friendly, concise, and a bit witty."
                                        className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/50 rounded-xl p-3 border border-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Document Memory */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Document Memory</h3>
                            </div>

                            <p className="text-white/60 text-sm mb-6">
                                Upload a document (like a resume) to give the AI specific context for your chats.
                            </p>

                            <div className="flex-grow">
                                <label
                                    htmlFor="pdf"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 hover:border-violet-400/50 transition-all duration-300 group"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-12 h-12 text-white/40 group-hover:text-violet-400 transition-colors mb-3" />
                                        <p className="mb-2 text-sm text-white/60">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-white/40">PDF only</p>
                                    </div>
                                    <input
                                        id="pdf"
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handlePdfChange}
                                    />
                                </label>

                                {/* Loading State */}
                                {isLoading && (
                                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-yellow-300 text-sm">Analyzing document...</span>
                                        </div>
                                    </div>
                                )}

                                {/* File Info Display */}
                                {localPdfFilename && !isLoading && (
                                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                <span className="text-emerald-300 text-sm font-medium truncate">{localPdfFilename}</span>
                                            </div>
                                            <button
                                                onClick={handleClearPdf}
                                                className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                title="Clear Document"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Display Structured Data */}
                                {structuredData && (
                                    <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                                        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-white/10">
                                            <Brain className="w-5 h-5 text-violet-400" />
                                            <h4 className="font-semibold text-white">Extracted Document Data</h4>
                                        </div>
                                        <pre className="text-xs text-emerald-300 whitespace-pre-wrap break-words font-mono">
                                            {JSON.stringify(structuredData, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end items-center mt-8 pt-6 border-t border-white/10">
                        {saveStatus && <p className="text-sm text-white/70 mr-4 transition-opacity duration-300">{saveStatus}</p>}
                        <button
                            onClick={handleSaveChanges}
                            disabled={saveStatus === 'Saving...'}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-purple-500 hover:to-violet-500 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Memory</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Memory;
