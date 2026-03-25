import axios from 'axios';
import type { AuthResponse, Comment, CreateRecipeDto, LikeStatus, LoginCredentials, PaginatedResponse, Recipe, RegisterData } from '../types';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('fozzokosan-auth');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', registerData);
    return data;
  },
};

export interface RecipeListParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export const recipeApi = {
  list: async (params?: RecipeListParams): Promise<PaginatedResponse<Recipe>> => {
    const { data } = await api.get<PaginatedResponse<Recipe>>('/recipes', { params });
    return data;
  },
  get: async (id: string): Promise<Recipe> => {
    const { data } = await api.get<Recipe>(`/recipes/${id}`);
    return data;
  },
  create: async (recipeData: CreateRecipeDto): Promise<Recipe> => {
    const { data } = await api.post<Recipe>('/recipes', recipeData);
    return data;
  },
  update: async (id: string, recipeData: Partial<CreateRecipeDto>): Promise<Recipe> => {
    const { data } = await api.patch<Recipe>(`/recipes/${id}`, recipeData);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },
};

export const likeApi = {
  getStatus: async (recipeId: string): Promise<LikeStatus> => {
    const { data } = await api.get<LikeStatus>(`/recipes/${recipeId}/likes`);
    return data;
  },
  toggle: async (recipeId: string): Promise<{ liked: boolean }> => {
    const { data } = await api.post<{ liked: boolean }>(`/recipes/${recipeId}/likes`);
    return data;
  },
};

export const commentApi = {
  list: async (recipeId: string, page = 1): Promise<PaginatedResponse<Comment>> => {
    const { data } = await api.get<PaginatedResponse<Comment>>(
      `/recipes/${recipeId}/comments`,
      { params: { page } },
    );
    return data;
  },
  create: async (recipeId: string, content: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/recipes/${recipeId}/comments`, { content });
    return data;
  },
  delete: async (recipeId: string, commentId: string): Promise<void> => {
    await api.delete(`/recipes/${recipeId}/comments/${commentId}`);
  },
};
