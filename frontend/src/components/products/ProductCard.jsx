import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await onAddToCart(product);
    } catch (err) {
      setError('Error al agregar al carrito');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition relative">
      <img
        src={imageError ? '/default-product.png' : product.image}
        alt={product.name}
        onError={() => setImageError(true)}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600 truncate">{product.description}</p>
      <p className="text-blue-700 font-bold my-2">
        {new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(product.price)}
      </p>
      <p className={`mb-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
      </p>
      <button
        disabled={loading || product.stock <= 0}
        onClick={handleAdd}
        className="bg-blue-500 disabled:bg-gray-400 text-white py-2 px-4 rounded w-full"
      >
        {loading ? 'Agregando...' : 'Agregar al carrito'}
      </button>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </div>
  );
}
