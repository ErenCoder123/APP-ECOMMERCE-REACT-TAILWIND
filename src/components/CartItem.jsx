import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();
  const { produto, quantidade } = item;
  const atMaxStock = quantidade >= produto.estoque;
  const [showMaxMsg, setShowMaxMsg] = useState(false);

  function handleIncrease() {
    if (atMaxStock) {
      setShowMaxMsg(true);
      setTimeout(() => setShowMaxMsg(false), 2500);
      return;
    }
    increaseQty(produto.id);
  }

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/100x100?text=Sem+Imagem';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{produto.nome}</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Preço unitário: <span className="text-emerald-400 font-medium">R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            Estoque máximo: {produto.estoque} un.
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => decreaseQty(produto.id)}
                disabled={quantidade <= 1}
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
              >
                −
              </button>
              <span className="px-4 py-1.5 text-white font-semibold text-sm min-w-[3rem] text-center border-x border-white/10">
                {quantidade}
              </span>
              <button
                onClick={handleIncrease}
                disabled={atMaxStock}
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(produto.id)}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              title="Remover item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>

          {/* Max stock message */}
          {(atMaxStock || showMaxMsg) && (
            <p className="mt-2 text-xs text-amber-400 flex items-center gap-1.5 animate-pulse">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Estoque máximo atingido
            </p>
          )}
        </div>

        {/* Total */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:min-w-[120px]">
          <span className="text-xs text-slate-500 sm:mb-1">Subtotal</span>
          <span className="text-lg font-bold text-emerald-400">
            R$ {(produto.preco * quantidade).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </div>
  );
}
