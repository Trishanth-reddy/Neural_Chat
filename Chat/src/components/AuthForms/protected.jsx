import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/authContext'; // Assuming you have an AuthContext


const ProtectedRoute = () => {
    const { user, isLoading } = useAuth(); 

    if (isLoading) {
        return (
            <div className="relative w-full h-screen flex justify-center items-center text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;




