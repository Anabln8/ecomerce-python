import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useContext(CartContext);

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) updateQuantity(item.id, qty);
  };

  return (
    <div className="flex items-center border-b py-2">
      <img
        src={item.image || '/default-product.png'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p>Precio: {item.price.toFixed(2)} €</p>
        <p>Subtotal: {(item.price * item.quantity).toFixed(2)} €</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2 bg-gray-200 rounded"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-12 text-center border rounded"
        />
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 bg-gray-200 rounded"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="ml-4 text-red-500 font-bold"
        >
          X
        </button>
      </div>
    </div>
  );
}
