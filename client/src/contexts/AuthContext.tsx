import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário padrão para sistema sem autenticação
const DEFAULT_USER: User = {
  id: 1,
  email: 'admin@orquestrador.local',
  name: 'Administrador',
  username: 'admin',
  role: 'admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sistema sem autenticação - sempre retorna usuário padrão
  const [user] = useState<User>(DEFAULT_USER);
  const [token] = useState<string>('no-auth-token');
  const [isLoading, setIsLoading] = useState(false);

  // Inicialização imediata
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Funções vazias (não fazem nada, pois não há autenticação)
  const login = async (email: string, password: string) => {
    // Sistema sem autenticação - não faz nada
    console.log('Sistema configurado sem autenticação');
  };

  const register = async (name: string, email: string, password: string, username?: string) => {
    // Sistema sem autenticação - não faz nada
    console.log('Sistema configurado sem autenticação');
  };

  const logout = () => {
    // Sistema sem autenticação - não faz nada
    console.log('Sistema configurado sem autenticação');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: true, // Sempre autenticado
    isLoading: false,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
