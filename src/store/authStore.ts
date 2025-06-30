
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, ApiResponse } from '../types/stock';
import { apiClient } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response: AuthResponse = await apiClient.post('/auth/login', {
            email,
            password,
          });
          

          if (response.data.success && response.data) {
            const { token, user } = response.data;
            localStorage.setItem('auth_token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        try {
          const response: ApiResponse = await apiClient.post('/auth/register', {
            email,
            password,
            name,
          });

          if (response.data.success) {
            // After successful registration, automatically log in
            await get().login(email, password);
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
          const response: ApiResponse<User> = await apiClient.get('/auth/me');
          if (response.data.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          } else {
            get().logout();
          }
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
