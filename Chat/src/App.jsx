import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import ProtectedRoute from './components/AuthForms/protected.jsx';
import Sidebar from './components/ui/Sidebar.jsx';

const Login   = lazy(() => import('./components/AuthForms/login.jsx'));
const Signup  = lazy(() => import('./components/AuthForms/Signup.jsx'));
const Chat    = lazy(() => import('./components/Home/Chat/Chat.jsx'));
const History = lazy(() => import('./components/History/History.jsx'));
const Memory  = lazy(() => import('./components/Memory/Memory.jsx'));
const Upgrade = lazy(() => import('./components/Upgrade/Upgrade.jsx'));
const Profile = lazy(() => import('./components/Profile/Profile.jsx'));

const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    404 - Not Found
  </div>
);

function LayoutWrapper() {
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

function App() {
  return (
    <ErrorBoundary>
      
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
    </ErrorBoundary>
  );
}

export default App;
