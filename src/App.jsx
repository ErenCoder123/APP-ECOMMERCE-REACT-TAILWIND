import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produto/:id" element={<ProductDetails />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/cadastro" element={<ProductForm />} />
                <Route path="/editar/:id" element={<ProductForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">RetroVault</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    © {new Date().getFullYear()} RetroVault. Todos os direitos reservados.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
