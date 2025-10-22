import React from 'react';
import {
    Home, History, Brain, Zap, User, LogOut,
    MessageCircle, Settings, Crown
} from 'lucide-react';
import axios from 'axios'; // FIX: Imported axios
import { useNavigate } from 'react-router-dom'; // FIX: Imported useNavigate for redirection

const Sidebar = ({ expanded, setExpanded }) => {
    const navigate = useNavigate(); // FIX: Initialized the navigate function

    // FIX: Moved the logout logic into a standalone function for clarity
    const handleLogout = async (event) => {
        event.preventDefault(); // Prevents the link from navigating immediately
        try {
            await axios.post(
                'http://localhost:5000/api/auth/v1/logout', // Corrected the endpoint to /logout
                {}, // POST requests should have a body, even if empty
                { withCredentials: true } // Ensures the browser sends the auth cookie to be cleared
            );
            navigate('/login'); // Redirect to login page on successful logout
        } catch (err) {
            console.error("Logout failed:", err);
            // Even if the server call fails, redirect to login as a fallback
            navigate('/login');
        }
    };

    const menuItems = [
        {
            id: 1,
            icon: MessageCircle,
            label: 'Chat',
            href: '/',
        },
        {
            id: 2,
            icon: History,
            label: 'History',
            href: '/history',
        },
        {
            id: 3,
            icon: Brain,
            label: 'Memory',
            href: '/memory',
        },
        {
            id: 4,
            icon: Crown,
            label: 'Upgrade',
            href: '/upgrade',
        },
        {
            id: 5,
            icon: User,
            label: 'Profile',
            href: '/profile',
        },
        {
            id: 6,
            icon: LogOut,
            label: 'Logout',
            href: '/login',
            onClick: handleLogout, // FIX: Assigned the corrected handler
        },
    ];

    return (
        <div
            className={`h-full bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 text-white transition-all duration-300 shadow-2xl backdrop-blur-xl border-r border-white/10 ${expanded ? 'w-64' : 'w-16'
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
                    className={`overflow-hidden transition-all duration-300 text-lg font-semibold ${expanded ? 'w-40 ml-3 opacity-100' : 'w-0 opacity-0'
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
                        return (
                            <a
                                key={index}
                                href={item.href}
                                onClick={item.onClick} // Use the onClick handler if it exists
                                className={`group relative flex items-center px-3 py-3 text-white/80 transition-all duration-200 rounded-xl hover:bg-white/10 hover:text-white hover:scale-105 ${!expanded ? 'justify-center' : ''
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 ${expanded ? 'mr-3' : ''}`}>
                                    <IconComponent
                                        className={`w-6 h-6 transition-colors duration-200 ${item.id === 4 ? 'text-violet-500' : 'group-hover:text-violet-400'
                                            }`}
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className={`overflow-hidden transition-all duration-200 font-medium ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Hover effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />

                                {/* Active indicator */}


                                {/* Tooltip for collapsed state */}
                                {!expanded && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        {item.label}
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                                    </div>
                                )}
                            </a>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-4 left-0 right-0 px-2">
                <div className={`p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 ${expanded ? 'opacity-100' : 'opacity-0'
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
