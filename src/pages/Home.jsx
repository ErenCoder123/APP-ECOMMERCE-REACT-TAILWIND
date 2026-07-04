import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProdutos } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const { data: produtos, loading, error } = useFetch(getProdutos, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const categorias = useMemo(() => {
    if (!produtos) return [];
    return [...new Set(produtos.map(p => p.categoria).filter(Boolean))];
  }, [produtos]);

  const filteredProducts = useMemo(() => {
    if (!produtos) return [];
    let result = [...produtos];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.nome.toLowerCase().includes(term) || p.descricao.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filterCategory) {
      result = result.filter(p => p.categoria === filterCategory);
    }

    // Sort
    if (sortBy === 'preco-asc') result.sort((a, b) => a.preco - b.preco);
    else if (sortBy === 'preco-desc') result.sort((a, b) => b.preco - a.preco);
    else if (sortBy === 'nome-asc') result.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (sortBy === 'nome-desc') result.sort((a, b) => b.nome.localeCompare(a.nome));

    return result;
  }, [produtos, searchTerm, sortBy, filterCategory]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-slate-700/50" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-slate-700/50 rounded" />
                <div className="h-5 w-3/4 bg-slate-700/50 rounded" />
                <div className="h-7 w-1/2 bg-slate-700/50 rounded" />
                <div className="h-10 w-full bg-slate-700/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar produtos</h2>
          <p className="text-slate-400 mb-2">{error}</p>
          <p className="text-slate-500 text-sm">Verifique se o JSON Server está rodando em <code className="text-violet-400">http://localhost:3001</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
          Reviva o <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Clássico</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Os melhores consoles, cartuchos e acessórios retrô para colecionadores e gamers de verdade. Entre no cofre do tempo!
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/cadastro" className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white font-semibold text-sm hover:from-pink-500 hover:to-violet-500 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300">
            Cadastrar Novo Jogo
          </Link>
          <Link to="/carrinho" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm transition-all duration-200">
            Ver Carrinho
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchBar
        onSearch={setSearchTerm}
        onSort={setSortBy}
        onFilterCategory={setFilterCategory}
        categorias={categorias}
      />

      {/* Product Count */}
      <p className="text-slate-500 text-sm mb-6">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-slate-400">Tente ajustar os filtros ou termos de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(produto => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
