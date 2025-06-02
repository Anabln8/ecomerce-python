import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartSummary() {
  const { subtotal, iva, total } = useContext(CartContext);

  return (
    <div className="border p-4 rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Resumen del carrito</h3>
      <p>Subtotal: {subtotal.toFixed(2)} €</p>
      <p>IVA (16%): {iva.toFixed(2)} €</p>
      <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>
      <button
        className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        onClick={() => alert('Proceder al checkout')}
      >
        Proceder al checkout
      </button>
      {/* Aquí puedes agregar info de envío o códigos de descuento */}
    </div>
  );
}
