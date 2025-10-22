import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { MemoryProvider } from './Context/MemoryProvider.jsx';
import { PaymentProvider } from './Context/PaymentProvider.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MemoryProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </MemoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);