import React, { useContext } from 'react';
import CheckoutForm from '../components/cart/CheckoutForm';
import { CartContext } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems } = useContext(CartContext);

  if (cartItems.length === 0) {
    return <p className="p-4">Tu carrito está vacío. Agrega productos antes de hacer el checkout.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Finalizar Compra</h2>
      <CheckoutForm />
    </div>
  );
}
