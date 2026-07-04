import { useState } from 'react';

export default function SearchBar({ onSearch, onSort, onFilterCategory, categorias }) {
  const [search, setSearch] = useState('');

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
        />
      </div>

      {/* Category Filter */}
      <select
        onChange={(e) => onFilterCategory(e.target.value)}
        className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm appearance-none cursor-pointer"
      >
        <option value="">Todas Categorias</option>
        {categorias.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        onChange={(e) => onSort(e.target.value)}
        className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm appearance-none cursor-pointer"
      >
        <option value="">Ordenar por</option>
        <option value="preco-asc">Menor Preço</option>
        <option value="preco-desc">Maior Preço</option>
        <option value="nome-asc">Nome (A-Z)</option>
        <option value="nome-desc">Nome (Z-A)</option>
      </select>
    </div>
  );
}
