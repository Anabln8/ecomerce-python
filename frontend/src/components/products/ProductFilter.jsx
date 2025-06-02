// src/components/products/ProductFilter.jsx
import React, { useState } from 'react';

export default function ProductFilter({ categories = [], onFilter }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onFilter(e.target.value, category);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onFilter(search, e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={handleSearchChange}
        className="border rounded px-3 py-2 flex-grow"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className="border rounded px-3 py-2"
      >
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
