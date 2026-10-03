import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import type { LoginCredentials, MessageResponse, RegisterData, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<MessageResponse>;
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

        // A regisztráció NEM jelentkeztet be: előbb meg kell erősíteni az emailt.
        register: async (data: RegisterData) => {
          return authApi.register(data);
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
