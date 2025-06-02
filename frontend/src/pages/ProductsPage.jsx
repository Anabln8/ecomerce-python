import React, { useEffect, useState, useContext } from 'react';
import ProductList from '../components/products/ProductList';
import ProductFilter from '../components/products/ProductFilter';
import { CartContext } from '../context/CartContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();

        console.log('Respuesta del backend:', data);

        const productArray = data.products;
        if (!Array.isArray(productArray)) {
          throw new Error('El backend no devolvió una lista de productos.');
        }

        setProducts(productArray);
        setFilteredProducts(productArray);
        setCategories([...new Set(productArray.map(p => p.category))]);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = (searchTerm, category) => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('access_token');
console.log('Token de autenticación:', token);
    if (!token) {
      console.error('No se encontró token de autenticación');
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
console.log('Agregando producto al carrito:', token, product);
    try {
      const response = await fetch('http://localhost:5000/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
        credentials: 'include', // Necesario si usas cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'No se pudo agregar al carrito');
      }

      const updatedCart = await response.json();

      addToCart(product);
      console.log('Producto agregado al carrito:', updatedCart);
    } catch (error) {
      console.error('Error al agregar al carrito:', error.message);
      alert('Error al agregar al carrito: ' + error.message);
    }
  };

  return (
    <div>
      <ProductFilter categories={categories} onFilter={handleFilter} />
      <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
    </div>
  );
}
