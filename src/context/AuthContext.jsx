import { createContext, useContext, useState } from 'react';
import { getUsuarios } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

function loadUserFromStorage() {
  try {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUserFromStorage);

  async function login(email, senha) {
    const usuarios = await getUsuarios();
    const found = usuarios.find(
      u => u.email === email && u.senha === senha
    );
    if (!found) {
      throw new Error('E-mail ou senha inválidos');
    }
    const { senha: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    localStorage.setItem('usuario', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('usuario');
  }

  const value = { user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
