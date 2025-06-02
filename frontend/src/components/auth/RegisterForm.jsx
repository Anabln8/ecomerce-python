import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function RegisterForm() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validatePasswordStrength = (password) => password.length >= 8;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }
    if (!validatePasswordStrength(password)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      window.location.href = '/';
    } catch (e) {
      setError(e.response?.data?.error || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Registrarse</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        className="w-full mb-2 p-2 border"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full mb-2 p-2 border"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="w-full mb-2 p-2 border"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar Contraseña"
        className="w-full mb-4 p-2 border"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        {loading ? 'Cargando...' : 'Registrar'}
      </button>
    </form>
  );
}
