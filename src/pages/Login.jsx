import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (authError) setAuthError('');
  }

  function validate() {
    const newErrors = {};
    const refs = { email: emailRef, senha: senhaRef };

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);

    const firstError = Object.keys(newErrors)[0];
    if (firstError && refs[firstError]?.current) {
      refs[firstError].current.focus();
    }

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAuthError('');
    try {
      await login(formData.email, formData.senha);
      navigate('/');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = (field) =>
    `w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
        : 'border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20'
    }`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Entrar na TechStore</h1>
          <p className="text-slate-400 mt-1 text-sm">Acesse sua conta para gerenciar produtos</p>
        </div>

        {/* Auth Error */}
        {authError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-red-300 text-sm">{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-slate-800/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">E-mail</label>
            <input ref={emailRef} type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className={inputClasses('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-1.5">Senha</label>
            <input ref={senhaRef} type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} placeholder="••••••••" className={inputClasses('senha')} />
            {errors.senha && <p className="mt-1.5 text-xs text-red-400">{errors.senha}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-50 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-white/5">
          <p className="text-xs text-slate-500 text-center mb-2">Credenciais de teste:</p>
          <div className="text-xs text-slate-400 text-center space-y-0.5">
            <p><span className="text-slate-500">E-mail:</span> admin@loja.com</p>
            <p><span className="text-slate-500">Senha:</span> admin123</p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
            ← Voltar à loja
          </Link>
        </p>
      </div>
    </div>
  );
}
