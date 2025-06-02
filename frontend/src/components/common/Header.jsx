import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


export default function Header() {
  const { user, logout } = useContext(AuthContext);
console.log("Header user:", user);
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">E-Commerce</Link>
      <nav className="space-x-4">
        <Link to="/products">Productos</Link>
        <Link to="/cart">Carrito</Link>
        {user ? (
          <>
            <Link to="/profile">Perfil</Link>
            <Link to="/orders">Órdenes</Link>
            <button onClick={logout} className="bg-white text-blue-600 px-2 py-1 rounded">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}
