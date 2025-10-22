import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoryContext } from './Context/memoryProvider.jsx';
import { PaymentContext } from '../../Context/PaymentProvider.jsx';
import DarkVeil from '../../DarkVeil/DarkVeil';
import {
    Mail, Bot, Edit, Trash2, Crown, ShieldCheck,
    Sparkles, User, Camera, FileText, Settings
} from 'lucide-react';
import axios from 'axios'; // FIX: Imported axios

function Profile() {
    const { memoryData, setMemoryData } = useContext(MemoryContext);
    const { paymentData } = useContext(PaymentContext);
    const navigate = useNavigate();

    // FIX: State to hold user data fetched from the backend
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for avatar
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [imageError, setImageError] = useState(false);

    // FIX: Fetch user data when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://neural-chat-prss.onrender.com/api/auth/v1/me', {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                if (error.response?.status === 401) {
                    navigate('/login'); // Redirect to login if not authenticated
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);
    

    // Handlers
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageError(false);
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleImageError = () => setImageError(true);

    const getInitials = (name) => {
        if (!name) return "?";
        const names = name.split(" ");
        const initials = names.map(n => n[0]).join("");
        return initials.slice(0, 2).toUpperCase();
    };

    useEffect(() => {
        return () => {
            if (avatarUrl && avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    const handleEditMemory = () => navigate('/memory');

    const handleClearMemory = () => {
        setMemoryData(prev => ({
            ...prev,
            wyd: '',
            know: '',
            trait: '',
            pdfFile: null,
            pdfText: '',
            structuredData: null
        }));
        // FIX: Replaced alert with a less intrusive confirmation if needed, or just perform the action.
        console.log("AI memory has been cleared.");
    };

    // Plan details
    const planDetails = {
        'Basic': {
            text: 'Basic Plan',
            icon: ShieldCheck,
            colorClasses: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        },
        'Pro': {
            text: 'Pro Plan',
            icon: Crown,
            colorClasses: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
        },
        'ProPlus': {
            text: 'Pro+ Plan',
            icon: Sparkles,
            colorClasses: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        }
    };

    const currentPlan = planDetails[paymentData.planName] || planDetails.Basic;
    const PlanIcon = currentPlan.icon;

    if (loading) {
        return (
            <div className="relative w-full h-screen flex justify-center items-center text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
            <DarkVeil className="absolute inset-0 w-full h-full z-0" />

            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20 z-[1]" />

            <div className="absolute inset-0 flex justify-center items-center z-10 p-4">
                <div className="flex flex-col h-[92vh] w-full max-w-5xl p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 flex-shrink-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <User className="w-8 h-8 text-violet-400" />
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Your Profile
                            </h1>
                        </div>
                        <p className="text-white/60 text-center">Manage your account and AI preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Profile Info */}
                        <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center">

                            {/* Avatar Section */}
                            <div className="relative mb-6">
                                {imageError || !avatarUrl ? (
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-white/20 mb-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm">
                                        <span className="text-2xl font-bold text-white/80">{getInitials(user?.username)}</span>
                                    </div>
                                ) : (
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-white/20 mb-4"
                                        onError={handleImageError}
                                    />
                                )}

                                {/* Camera overlay */}
                                <label htmlFor="avatarUpload" className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                                    <Camera className="w-4 h-4 text-white" />
                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        className="hidden"
                                        accept="image/png, image/jpeg"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>

                            {/* User Info */}
                            <div className="w-full">
                                <h2 className="text-xl font-semibold text-white mb-2">{user?.username || 'User'}</h2>
                                <div className="flex items-center justify-center text-white/60 text-sm mb-4">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span>{user?.email || 'No email'}</span>
                                </div>

                                {/* Plan Badge */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${currentPlan.colorClasses}`}>
                                    <PlanIcon className="w-4 h-4" />
                                    <span>{currentPlan.text}</span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 w-full space-y-2">
                                <button
                                    onClick={handleEditMemory}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Configure AI Memory</span>
                                </button>

                                <button
                                    onClick={() => navigate('/upgrade')}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Crown className="w-4 h-4" />
                                    <span>Upgrade Plan</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Column - AI Memory Status */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">AI Memory Status</h3>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleEditMemory}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                        title="Edit Memory"
                                    >
                                        <Edit className="w-4 h-4 text-white/80" />
                                    </button>
                                    <button
                                        onClick={handleClearMemory}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                                        title="Clear Memory"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personality Traits */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-white/80">
                                        <Sparkles className="w-4 h-4 text-violet-400" />
                                        <span className="font-medium">Personality Traits</span>
                                    </div>
                                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <p className="text-white/90 text-sm">
                                            {memoryData.trait || (
                                                <span className="text-white/50 italic">Not configured yet</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-white/80">
                                        <ShieldCheck className="w-4 h-4 text-violet-400" />
                                        <span className="font-medium">Your Role</span>
                                    </div>
                                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <p className="text-white/90 text-sm">
                                            {memoryData.wyd || (
                                                <span className="text-white/50 italic">Not specified</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Key Information */}
                                <div className="space-y-3 md:col-span-2">
                                    <div className="flex items-center space-x-2 text-white/80">
                                        <Bot className="w-4 h-4 text-violet-400" />
                                        <span className="font-medium">Key Information</span>
                                    </div>
                                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <p className="text-white/90 text-sm leading-relaxed">
                                            {memoryData.know || (
                                                <span className="text-white/50 italic">No additional information provided</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Document Status */}
                                {/* Document Status */}
<div className="space-y-3 md:col-span-2 pt-4 border-t border-white/10">
    <div className="flex items-center space-x-2 text-white/80">
        <FileText className="w-4 h-4 text-violet-400" />
        <span className="font-medium">Active Document</span>
    </div>
    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {memoryData.pdfFilename ? (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                    {/* FIX: Display the pdfFilename string from the database */}
                    <p className="text-emerald-300 font-medium text-sm">{memoryData.pdfFilename}</p>
                    <p className="text-white/50 text-xs">Document analyzed and ready</p>
                </div>
            </div>
        ) : (
            <p className="text-white/50 italic text-sm">No document uploaded</p>
        )}
    </div>
</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
