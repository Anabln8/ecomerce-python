import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const order = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        total,
        shippingAddress: address,
        paymentMethod: 'fake-payment',
      };

      const res = await api.post('/orders', order);
      clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar la orden.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Debes iniciar sesión para continuar con el checkout.</p>;
  if (cartItems.length === 0) return <p>Tu carrito está vacío.</p>;

  return (
    <form onSubmit={handleCheckout} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl">Finalizar Compra</h2>

      <div>
        <label className="block font-medium">Dirección de Envío</label>
        <textarea
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Resumen</h3>
        <ul className="divide-y">
          {cartItems.map((item) => (
            <li key={item.id} className="py-2">
              {item.name} x{item.quantity} - {(item.price * item.quantity).toFixed(2)} €
            </li>
          ))}
        </ul>
        <p className="font-semibold mt-2">Total: {total.toFixed(2)} €</p>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Confirmar y Pagar'}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
