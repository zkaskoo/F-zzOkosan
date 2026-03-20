import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import type { LoginCredentials, RegisterData, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: async (credentials: LoginCredentials) => {
          const response = await authApi.login(credentials);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
          });
        },

        register: async (data: RegisterData) => {
          const response = await authApi.register(data);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
          });
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        },
      }),
      {
        name: 'fozzokosan-auth',
      },
    ),
  ),
);
