import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProdutoById, createProduto, updateProduto } from '../services/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const nomeRef = useRef(null);
  const descricaoRef = useRef(null);
  const precoRef = useRef(null);
  const imagemRef = useRef(null);
  const estoqueRef = useRef(null);
  const categoriaRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagem: '',
    estoque: '',
    categoria: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      setPageLoading(true);
      getProdutoById(id)
        .then(produto => {
          setFormData({
            nome: produto.nome || '',
            descricao: produto.descricao || '',
            preco: String(produto.preco ?? ''),
            imagem: produto.imagem || '',
            estoque: String(produto.estoque ?? ''),
            categoria: produto.categoria || '',
          });
        })
        .catch(() => navigate('/404'))
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    const refs = {
      nome: nomeRef,
      descricao: descricaoRef,
      preco: precoRef,
      imagem: imagemRef,
      estoque: estoqueRef,
      categoria: categoriaRef,
    };

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.preco && formData.preco !== '0') {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.preco)) || Number(formData.preco) < 0) {
      newErrors.preco = 'Preço deve ser um número ≥ 0';
    }
    if (!formData.imagem.trim()) newErrors.imagem = 'URL da imagem é obrigatória';
    if (!formData.estoque && formData.estoque !== '0') {
      newErrors.estoque = 'Estoque é obrigatório';
    } else if (isNaN(Number(formData.estoque)) || Number(formData.estoque) < 0 || !Number.isInteger(Number(formData.estoque))) {
      newErrors.estoque = 'Estoque deve ser um número inteiro ≥ 0';
    }
    if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória';

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
    try {
      const produto = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        preco: Number(formData.preco),
        imagem: formData.imagem.trim(),
        estoque: Number(formData.estoque),
        categoria: formData.categoria.trim(),
      };

      if (isEditing) {
        await updateProduto(id, produto);
      } else {
        await createProduto(produto);
      }
      navigate('/');
    } catch (err) {
      alert('Erro ao salvar produto: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-slate-700/50 rounded" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-slate-700/50 rounded" />
              <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inputClasses = (field) =>
    `w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
        : 'border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20'
    }`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to="/" className="hover:text-violet-400 transition-colors">Início</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-slate-300">{isEditing ? 'Editar Item Retrô' : 'Cadastrar Item Retrô'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-8">
        {isEditing ? 'Editar Item Retrô' : 'Cadastrar Novo Item Retrô'}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-1.5">Nome do Item *</label>
          <input ref={nomeRef} type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Super Mario World - Cartucho SNES" className={inputClasses('nome')} />
          {errors.nome && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.nome}</p>}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-slate-300 mb-1.5">Descrição e Estado de Conservação *</label>
          <textarea ref={descricaoRef} id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descreva os itens inclusos, o estado físico do cartucho/console, se salva progresso, etc..." rows={4} className={inputClasses('descricao')} />
          {errors.descricao && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.descricao}</p>}
        </div>

        {/* Preço e Estoque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-slate-300 mb-1.5">Preço (R$) *</label>
            <input ref={precoRef} type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inputClasses('preco')} />
            {errors.preco && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.preco}</p>}
          </div>
          <div>
            <label htmlFor="estoque" className="block text-sm font-medium text-slate-300 mb-1.5">Estoque *</label>
            <input ref={estoqueRef} type="number" id="estoque" name="estoque" value={formData.estoque} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClasses('estoque')} />
            {errors.estoque && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.estoque}</p>}
          </div>
        </div>

        {/* Imagem URL */}
        <div>
          <label htmlFor="imagem" className="block text-sm font-medium text-slate-300 mb-1.5">URL da Imagem *</label>
          <input ref={imagemRef} type="url" id="imagem" name="imagem" value={formData.imagem} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" className={inputClasses('imagem')} />
          {errors.imagem && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.imagem}</p>}
          {formData.imagem && (
            <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-white/10">
              <img src={formData.imagem} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-slate-300 mb-1.5">Categoria *</label>
          <input ref={categoriaRef} type="text" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Ex: Consoles, Plataforma, RPGs, Acessórios" className={inputClasses('categoria')} />
          {errors.categoria && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>{errors.categoria}</p>}
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-50 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 shadow-pink-500/25 hover:shadow-pink-500/40"
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar Item' : 'Cadastrar Item'}
          </button>
          <Link
            to="/"
            className="py-3.5 px-6 rounded-xl font-semibold text-center text-slate-300 border border-white/10 hover:bg-white/5 transition-all duration-200"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
