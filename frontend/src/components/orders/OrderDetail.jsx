import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch {
        setError('Error al obtener detalles de la orden.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrder();
  }, [id, user]);

  if (!user) return <p>Debes iniciar sesión para ver esta orden.</p>;
  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>No se encontró la orden.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Detalles de la Orden #{order.id}</h2>
      <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
      <p>Total: {order.total.toFixed(2)} €</p>
      <p>Estado: {order.status}</p>
      <p>Dirección de envío: {order.shippingAddress}</p>

      <h3 className="text-xl mt-4 mb-2">Productos:</h3>
      <ul className="space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            <p>Producto: {item.name}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>Precio unitario: {item.price.toFixed(2)} €</p>
            <p>Subtotal: {(item.quantity * item.price).toFixed(2)} €</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
