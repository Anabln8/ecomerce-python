// src/components/products/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No hay productos para mostrar.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
