import React from 'react';
import { 
    Home, History, Brain, Zap, User, LogOut, 
    MessageCircle, Settings, Crown 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // 1. Import Link and useLocation

const Sidebar = ({ expanded, setExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Optional: to highlight active tab

    const handleLogout = async (event) => {
        event.preventDefault(); 
        try {
            // Ensure this URL matches your actual backend URL (env var is better)
            await axios.post(
                'https://neural-chat-prss.onrender.com/api/auth/v1/logout', 
                {}, 
                { withCredentials: true }
            );
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
            navigate('/login');
        }
    };

    const menuItems = [
        {
            id: 1,
            icon: MessageCircle,
            label: 'Chat',
            path: '/', // Changed 'href' to 'path' for clarity
        },
        {
            id: 2,
            icon: History,
            label: 'History',
            path: '/history',
        },
        {
            id: 3,
            icon: Brain,
            label: 'Memory',
            path: '/memory',
        },
        {
            id: 4,
            icon: Crown,
            label: 'Upgrade',
            path: '/upgrade',
        },
        {
            id: 5,
            icon: User,
            label: 'Profile',
            path: '/profile',
        },
        // Logout is special, so we keep it separate in the map logic or handle it specifically
    ];

    return (
        <div 
            className={`h-full bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 text-white transition-all duration-300 shadow-2xl backdrop-blur-xl border-r border-white/10 ${
                expanded ? 'w-64' : 'w-16'
            }`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            {/* Header */}
            <div className="flex items-center p-4 border-b border-white/10 h-20">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">A</span>
                </div>
                <span 
                    className={`overflow-hidden transition-all duration-300 text-lg font-semibold ${
                        expanded ? 'w-40 ml-3 opacity-100' : 'w-0 opacity-0'
                    }`}
                >
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        Neural AI
                    </span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-2">
                <div className="space-y-2">
                    {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={index}
                                to={item.path} // 2. Use 'to' instead of 'href'
                                className={`group relative flex items-center px-3 py-3 text-white/80 transition-all duration-200 rounded-xl hover:bg-white/10 hover:text-white hover:scale-105 ${
                                    !expanded ? 'justify-center' : ''
                                } ${isActive ? 'bg-white/10 text-white shadow-lg shadow-violet-500/10' : ''}`}
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 ${expanded ? 'mr-3' : ''}`}>
                                    <IconComponent 
                                        className={`w-6 h-6 transition-colors duration-200 ${
                                            item.id === 4 ? 'text-violet-500' : 'group-hover:text-violet-400'
                                        }`} 
                                    />
                                </div>

                                {/* Label */}
                                <span 
                                    className={`overflow-hidden transition-all duration-200 font-medium ${
                                        expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                                    }`}
                                >
                                    {item.label}
                                </span>

                                {/* Hover effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />

                                {/* Tooltip for collapsed state */}
                                {!expanded && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        {item.label}
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    {/* Logout Button - Handled separately to allow onClick */}
                    <a
                        href="/login"
                        onClick={handleLogout}
                        className={`group relative flex items-center px-3 py-3 text-white/80 transition-all duration-200 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:scale-105 ${
                            !expanded ? 'justify-center' : ''
                        }`}
                    >
                        <div className={`flex-shrink-0 ${expanded ? 'mr-3' : ''}`}>
                            <LogOut className="w-6 h-6 transition-colors duration-200 group-hover:text-red-400" />
                        </div>
                        <span 
                            className={`overflow-hidden transition-all duration-200 font-medium ${
                                expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                            }`}
                        >
                            Logout
                        </span>
                        {!expanded && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Logout
                                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </div>
                        )}
                    </a>

                </div>
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-4 left-0 right-0 px-2">
                <div className={`p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 ${
                    expanded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-white/60">AI Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;