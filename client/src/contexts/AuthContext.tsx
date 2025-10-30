import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trpc } from '../lib/trpc';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mutations
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const verifyTokenQuery = trpc.auth.verifyToken.useQuery(
    { token: token || '' },
    { enabled: !!token }
  );

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Verify token when it changes
  useEffect(() => {
    if (token && verifyTokenQuery.data) {
      if (verifyTokenQuery.data.valid && verifyTokenQuery.data.user) {
        setUser(verifyTokenQuery.data.user as User);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [token, verifyTokenQuery.data]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      
      if (result.success && result.token && result.user) {
        setToken(result.token);
        setUser(result.user as User);
        localStorage.setItem('auth_token', result.token);
      } else {
        throw new Error('Login falhou');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, username?: string) => {
    try {
      const result = await registerMutation.mutateAsync({ 
        name, 
        email, 
        password,
        username 
      });
      
      if (result.success && result.token && result.user) {
        setToken(result.token);
        setUser(result.user as User);
        localStorage.setItem('auth_token', result.token);
      } else {
        throw new Error('Registro falhou');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
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
