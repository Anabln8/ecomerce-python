import React, { useContext } from 'react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const { cartItems } = useContext(CartContext);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary />
        </>
      )}
    </div>
  );
}
