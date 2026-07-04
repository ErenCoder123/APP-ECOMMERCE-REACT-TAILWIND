import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProdutoById, deleteProduto } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQty } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: produto, loading, error } = useFetch(() => getProdutoById(id), [id]);
  const [addedMsg, setAddedMsg] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-slate-800/50 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-700/50 rounded" />
            <div className="h-8 w-3/4 bg-slate-700/50 rounded" />
            <div className="h-10 w-1/3 bg-slate-700/50 rounded" />
            <div className="h-20 w-full bg-slate-700/50 rounded" />
            <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Produto não encontrado</h2>
        <p className="text-slate-400 mb-6">{error || 'O produto que você procura não existe.'}</p>
        <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
          Voltar à Home
        </Link>
      </div>
    );
  }

  const qtyInCart = getItemQty(produto.id);
  const esgotado = produto.estoque <= 0;
  const maxReached = qtyInCart >= produto.estoque;
  const canAdd = !esgotado && !maxReached;

  function handleAddToCart() {
    if (!canAdd) return;
    addToCart(produto);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  }

  async function handleDelete() {
    try {
      await deleteProduto(produto.id);
      navigate('/');
    } catch (err) {
      alert('Erro ao deletar produto: ' + err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to="/" className="hover:text-violet-400 transition-colors">Início</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-slate-300 truncate">{produto.nome}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-square">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Sem+Imagem';
            }}
          />
          {esgotado && (
            <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
              <span className="px-6 py-3 rounded-full bg-red-500/90 text-white text-lg font-bold uppercase tracking-wider">
                Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-2">
            {produto.categoria || 'Geral'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {produto.nome}
          </h1>
          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-slate-300 leading-relaxed mb-6">
            {produto.descricao}
          </p>

          {/* Stock Info */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${esgotado ? 'bg-red-500' : produto.estoque <= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className={`text-sm font-medium ${esgotado ? 'text-red-400' : produto.estoque <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {esgotado ? 'Fora de estoque' : `${produto.estoque} em estoque`}
            </span>
            {qtyInCart > 0 && (
              <span className="text-xs text-slate-500 ml-2">({qtyInCart} no carrinho)</span>
            )}
          </div>

          {/* Max Stock Message */}
          {maxReached && !esgotado && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="text-amber-300 text-sm font-medium">Estoque máximo atingido</span>
            </div>
          )}

          {/* Added to cart message */}
          {addedMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 animate-pulse">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-emerald-300 text-sm font-medium">Adicionado ao carrinho!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              {esgotado ? 'Produto Esgotado' : maxReached ? 'Estoque Máximo Atingido' : 'Adicionar ao Carrinho'}
            </button>

            <div className="flex gap-3">
              <Link
                to={`/editar/${produto.id}`}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-center text-white bg-slate-700 hover:bg-slate-600 transition-all duration-200 border border-white/10"
              >
                Editar Jogo
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
              >
                Excluir Jogo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
            <p className="text-slate-400 mb-6">Tem certeza que deseja excluir <strong className="text-white">{produto.nome}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
