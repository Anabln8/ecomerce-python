import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

import Header from './components/common/Header';
import { RoutesConfig } from './routes/RoutesConfig';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main className="container mx-auto p-4">
            <RoutesConfig />
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
