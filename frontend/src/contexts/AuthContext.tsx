import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout, AuthResponse } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await apiLogin({ email, password });
    setUser(response.user);
    setLoading(false);
    return response;
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await apiRegister({ name, email, password });
    setUser(response.user);
    setLoading(false);
    return response;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    navigate('/');
    toast.success("Logged out successfully");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role.toLowerCase() === 'admin',
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
