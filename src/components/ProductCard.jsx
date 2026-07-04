import { Link } from 'react-router-dom';

export default function ProductCard({ produto }) {
  const esgotado = produto.estoque <= 0;

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Sem+Imagem';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {esgotado && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-red-500/90 text-white text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
              Esgotado
            </span>
          </div>
        )}

        {!esgotado && produto.estoque <= 3 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-sm">
              Últimas {produto.estoque} un.
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-1">
          {produto.categoria || 'Geral'}
        </p>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors">
          {produto.nome}
        </h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </p>

        <Link
          to={`/produto/${produto.id}`}
          className="mt-4 w-full block text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
