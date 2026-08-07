'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  googleLogin: (email: string, name: string, avatarUrl?: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('task_master_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get<User>('/auth/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('task_master_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem('task_master_token', data.accessToken);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    saveAuthData(res.data);
  };

  const guestLogin = async () => {
    const res = await api.post<AuthResponse>('/auth/guest');
    saveAuthData(res.data);
  };

  const googleLogin = async (email: string, name: string, avatarUrl?: string) => {
    const res = await api.post<AuthResponse>('/auth/google', { email, name, avatarUrl });
    saveAuthData(res.data);
  };

  const register = async (email: string, name: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { email, name, password });
    saveAuthData(res.data);
  };

  const logout = () => {
    localStorage.removeItem('task_master_token');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        guestLogin,
        googleLogin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
