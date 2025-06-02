import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email y contraseña son requeridos');
      return;
    }
    if (!validateEmail(email)) {
      setError('Formato de email inválido');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      // Redirige a Home o a la página anterior
      window.location.href = '/';
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Iniciar sesión</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-2 p-2 border"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-4 p-2 border"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}
