import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import ProtectedRoute from './components/AuthForms/protected.jsx';
import Sidebar from './components/ui/Sidebar.jsx';

// Lazy load all route components for code splitting
const Login   = lazy(() => import('./components/AuthForms/login.jsx'));
const Signup  = lazy(() => import('./components/AuthForms/Signup.jsx'));
const Chat    = lazy(() => import('./components/Home/Chat/Chat.jsx'));
const History = lazy(() => import('./components/History/History.jsx'));
const Memory  = lazy(() => import('./components/Memory/Memory.jsx'));
const Upgrade = lazy(() => import('./components/Upgrade/Upgrade.jsx'));
const Profile = lazy(() => import('./components/Profile/Profile.jsx'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// 404 Not Found component
const NotFound = () => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
      <a 
        href="/" 
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

// Layout wrapper with sidebar
function LayoutWrapper() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <main className="flex-1 h-full overflow-hidden">
        <div className="h-full">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// Main App component
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayoutWrapper />}>
              <Route index element={<Chat />} />
              <Route path="chat/:chatId" element={<Chat />} />
              <Route path="history" element={<History />} />
              <Route path="memory" element={<Memory />} />
              <Route path="upgrade" element={<Upgrade />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
