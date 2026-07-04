import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cartItems, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.572M7.5 14.25h9m-9 0a3 3 0 01-5.98-.572M16.5 14.25a3 3 0 005.98.572M16.5 14.25h-9m9 0a3 3 0 015.98-.572M7.5 14.25L5.106 5.272M16.5 14.25l2.394-8.978M5.106 5.272H19.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-slate-400 mb-8">Adicione produtos incríveis ao seu carrinho!</p>
          <Link
            to="/"
            className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-300"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carrinho</h1>
          <p className="text-slate-400 mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all text-sm font-medium self-start"
        >
          Limpar Carrinho
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cartItems.map(item => (
          <CartItem key={item.produto.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 font-medium">Subtotal</span>
          <span className="text-white font-semibold">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <span className="text-slate-400 font-medium">Frete</span>
          <span className="text-emerald-400 font-medium text-sm">Grátis</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
          Finalizar Compra
        </button>
        <Link to="/" className="block text-center mt-4 text-sm text-slate-400 hover:text-violet-400 transition-colors">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
