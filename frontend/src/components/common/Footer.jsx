import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-10 border-t">
      <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} E-Commerce App. Todos los derechos reservados.</p>
    </footer>
  );
}
