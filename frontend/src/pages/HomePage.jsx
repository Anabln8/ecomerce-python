import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a la tienda</h1>
      <p className="mb-6 text-gray-600">Explora los mejores productos disponibles.</p>
      <Link to="/products" className="bg-blue-600 text-white px-4 py-2 rounded">
        Ver productos
      </Link>
    </div>
  );
}
