// Chat/src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { MemoryProvider } from './Context/memoryProvider.jsx';
import { PaymentProvider } from './Context/PaymentProvider.jsx'; // Make sure this file exists
import { AuthProvider } from './Context/authContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider MUST wrap everything that needs auth */}
      <AuthProvider>
        {/* MemoryProvider MUST wrap everything that needs memory */}
        <MemoryProvider>
          <PaymentProvider>
            {/* App contains all your routes and components */}
            <App />
          </PaymentProvider>
        </MemoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);