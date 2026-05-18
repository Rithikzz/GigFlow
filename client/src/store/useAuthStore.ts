import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const parseStoredUser = (): User | null => {
  const raw = localStorage.getItem('gigflow_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: parseStoredUser(),
  token: localStorage.getItem('gigflow_token'),
  isAuthenticated: !!localStorage.getItem('gigflow_token'),
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('gigflow_token', token);
    localStorage.setItem('gigflow_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, error: null });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('gigflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gigflow_user');
    }
    set((state) => ({ user, isAuthenticated: Boolean(state.token) && Boolean(user) }));
  },

  clearAuth: () => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
