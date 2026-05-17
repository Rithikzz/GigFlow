import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('gigflow_token'),
  isAuthenticated: !!localStorage.getItem('gigflow_token'),
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('gigflow_token', token);
    set({ user, token, isAuthenticated: true, error: null });
  },

  clearAuth: () => {
    localStorage.removeItem('gigflow_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
