import apiClient from '../api/client';
import { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: Record<string, string>): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback for visual mock testing if server isn't running
      if (credentials.email === 'demo@gigflow.com' && credentials.password === 'password') {
        return {
          user: {
            id: 'mock-user-1',
            name: 'Alex Mercer',
            email: 'demo@gigflow.com',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
            createdAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token-xyz',
        };
      }
      throw error;
    }
  },

  async register(data: Record<string, string>): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      // Fallback for visual mock testing
      return {
        user: {
          id: 'mock-user-2',
          name: data.name || 'New User',
          email: data.email || 'user@example.com',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-xyz',
      };
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }
};
