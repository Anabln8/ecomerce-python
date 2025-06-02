import React from 'react';

export default function Loading({ message = "Cargando..." }) {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="text-gray-600 animate-pulse">{message}</div>
    </div>
  );
}
