import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Debes iniciar sesión para ver tu perfil.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
    </div>
  );
}
