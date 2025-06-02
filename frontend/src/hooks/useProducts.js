import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: filters });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]); // Regenera al cambiar filtros

  return { products, loading, error, refetch: fetchProducts };
}
