import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las órdenes');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (!user) return <p>Debes iniciar sesión para ver tu historial de órdenes.</p>;
  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Historial de Órdenes</h2>

      <div className="mb-4">
        <label className="mr-2">Filtrar por estado:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No hay órdenes para mostrar.</p>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <p>Orden #{order.id}</p>
              <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: {order.total.toFixed(2)} €</p>
              <p className="capitalize">Estado: {order.status}</p>
              <Link
                to={`/orders/${order.id}`}
                className="text-blue-500 underline mt-2 inline-block"
              >
                Ver detalles
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
