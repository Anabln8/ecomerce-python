// src/components/products/ProductDetail.jsx
import React from 'react';

export default function ProductDetail({ product }) {
  if (!product) return <p>Cargando producto...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 border rounded shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
        onError={(e) => { e.target.src = '/default-product.png'; }}
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="mb-4 text-gray-700">{product.description}</p>
      <p className="text-xl font-semibold mb-2">
        {new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(product.price)}
      </p>
      <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
        {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Producto agotado'}
      </p>
    </div>
  );
}
