import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/authContext'; // Assuming you have an AuthContext

/**
 * A component that acts as a gatekeeper for routes that require authentication.
 * It checks the user's authentication status before rendering the child routes.
 */
const ProtectedRoute = () => {
    // This hook would come from your AuthContext to get the current user and loading state.
    const { user, isLoading } = useAuth(); 

    // 1. Show a loading indicator while the initial authentication check is running.
    // This prevents a flicker where the user might briefly see the login page
    // before being redirected to the dashboard.
    if (isLoading) {
        return (
            <div className="relative w-full h-screen flex justify-center items-center text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // 2. If the authentication check is complete AND there is a user object,
    // it means the user is successfully logged in. The <Outlet /> component
    // then renders the actual page component you're trying to visit (e.g., <Profile />, <Chat />).
    if (user) {
        return <Outlet />;
    }

    // 3. If the loading is finished and there is NO user object,
    // the user is not authenticated. The <Navigate> component redirects them
    // to the /login page. The `replace` prop is used to replace the current
    // entry in the history stack, so the user can't click the "back" button
    // to get back to the protected page they were trying to access.
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;


