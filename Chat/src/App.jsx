import React, { Suspense, lazy, useState, useMemo } from 'react';
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


// Optimized loading fallback component - use minimal DOM
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);


// Route-specific loading fallback for faster perceived load
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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


// Optimized layout wrapper with memoization to prevent unnecessary re-renders
function LayoutWrapper() {
  const [expanded, setExpanded] = useState(false);
  
  // Memoize the sidebar to prevent re-renders when content changes
  const sidebarMemo = useMemo(
    () => <Sidebar expanded={expanded} setExpanded={setExpanded} />,
    [expanded]
  );
  
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {sidebarMemo}
      <main className="flex-1 h-full overflow-hidden">
        <div className="h-full">
          {/* Use lighter fallback for route transitions */}
          <Suspense fallback={<RouteLoadingFallback />}>
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
          
          {/* Protected routes with nested layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayoutWrapper />}>
              <Route 
                index 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Chat />
                  </Suspense>
                } 
              />
              <Route 
                path="chat/:chatId" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Chat />
                  </Suspense>
                } 
              />
              <Route 
                path="history" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <History />
                  </Suspense>
                } 
              />
              <Route 
                path="memory" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Memory />
                  </Suspense>
                } 
              />
              <Route 
                path="upgrade" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Upgrade />
                  </Suspense>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Profile />
                  </Suspense>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}


export default App;