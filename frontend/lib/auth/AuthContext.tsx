'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { User } from '@/types/auth';
import * as authApi from '@/lib/api/authApi';
import { TOKEN_KEY } from '@/lib/axios';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        // Token is invalid/expired — clear it
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login({ email, password });
    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authApi.register({ name, email, password });
    // Auto-login after registration
    await authApi.login({ email, password });
    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
