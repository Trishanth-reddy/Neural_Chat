import { Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';

// --- Components ---
// Layout
// FIX: Corrected the casing of the import path to match file system standards.
import Sidebar from './components/ui/sidebar';

// Authentication
// FIX: Corrected the import paths to be relative to the project root.
import Login from './components/AuthForms/login';
import Signup from "./components/AuthForms/Signup";
import ProtectedRoute from './components/AuthForms/protected';

// Page Components
// FIX: Corrected the import paths for all page components.
import Chat from './components/Home/Chat/Chat';
import History from './components/History/History';
import Upgrade from './components/Upgrade/Upgrade';
import Memory from './components/Memory/Memory';
import Profile from './components/Profile/Profile';

/**
 * The Layout component wraps pages that need the sidebar.
 * The <Outlet /> from react-router-dom is a placeholder that will
 * render the specific child route component (e.g., Chat, Profile).
 */
function Layout() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar expanded={expanded} setExpanded={setExpanded} />
            <main className="flex-1 h-full overflow-hidden">
                <div className="h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

/**
 * This is the main application component where all the routes are defined.
 */
function App() {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            {/* These routes are accessible to everyone and do not need the sidebar. */}
            {/* They are placed outside of the ProtectedRoute wrapper. */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* --- Protected Routes --- */}
            {/* This is the key change. We create a parent Route that uses the */}
            {/* `ProtectedRoute` component as its element. */}
            {/* - `ProtectedRoute` will check for a valid user session. */}
            {/* - If the user IS logged in, it will render the `<Outlet />`, which contains all the nested routes below. */}
            {/* - If the user is NOT logged in, it will automatically redirect them to "/login". */}
            <Route element={<ProtectedRoute />}>
            
                {/* All routes inside here are now protected. They will only be accessible */}
                {/* to authenticated users. They are also nested inside the `Layout` component, */}
                {/* which means they will all share the same sidebar. */}
                <Route path="/" element={<Layout />}>
                    {/* The `index` route is the default page shown for the parent path "/" */}
                    <Route index element={<Chat />} />
                    <Route path="/chat/:chatId" element={<Chat />} />

                    
                    {/* Other protected pages */}
                    <Route path="history" element={<History />} />
                    <Route path="memory" element={<Memory />} />
                    <Route path="upgrade" element={<Upgrade />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;

