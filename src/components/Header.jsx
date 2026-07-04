import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = getCartCount();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40 transition-shadow">
              {/* Game Controller Icon */}
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 12h.01M19 10h.01M19 14h.01M5 12.5h3m-1.5-1.5v3M12 5v14M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase font-mono">
              RetroVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              Início
            </Link>
            <Link to="/carrinho" className="relative px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.572M7.5 14.25h9m-9 0a3 3 0 01-5.98-.572M16.5 14.25a3 3 0 005.98.572M16.5 14.25h-9m9 0a3 3 0 015.98-.572M7.5 14.25L5.106 5.272M16.5 14.25l2.394-8.978M5.106 5.272H19.5" />
                </svg>
                Carrinho
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
            <Link to="/cadastro" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              Cadastrar Jogo
            </Link>
          </nav>

          {/* Auth Section (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300">{user.nome}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 transition-all duration-200 text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white text-sm font-semibold hover:from-pink-500 hover:to-violet-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-200"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3 animate-in slide-in-from-top">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm">
              Início
            </Link>
            <Link to="/carrinho" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm">
              Carrinho {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm">
              Cadastrar Jogo
            </Link>
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm">
                Sair ({user.nome})
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all text-sm">
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
