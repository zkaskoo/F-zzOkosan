import axios from 'axios';
import type { AuthResponse, Comment, CreateRecipeDto, LikeStatus, LoginCredentials, MealType, MenuPlan, PaginatedResponse, Recipe, RegisterData, ShoppingList, ShoppingListItem } from '../types';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid — clear auth state
      try {
        const raw = localStorage.getItem('fozzokosan-auth');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.state?.token) {
            parsed.state.token = null;
            parsed.state.user = null;
            parsed.state.isAuthenticated = false;
            localStorage.setItem('fozzokosan-auth', JSON.stringify(parsed));
            window.location.href = '/bejelentkezes';
          }
        }
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  },
);

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

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
};

export interface RecipeListParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  category?: string;
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

export interface IngredientSuggestion {
  id: string;
  name: string;
  normalizedName: string;
  defaultUnit: string | null;
  category: string;
}

export interface ParsedNlpIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export const nlpApi = {
  parseIngredients: async (text: string): Promise<ParsedNlpIngredient[]> => {
    const { data } = await api.post<{ ingredients: ParsedNlpIngredient[] }>('/nlp/parse-ingredients', { text });
    return data.ingredients;
  },
  status: async (): Promise<{ configured: boolean }> => {
    const { data } = await api.get<{ configured: boolean }>('/nlp/status');
    return data;
  },
};

export const ingredientApi = {
  search: async (query: string): Promise<IngredientSuggestion[]> => {
    if (!query.trim()) return [];
    const { data } = await api.get<IngredientSuggestion[]>('/ingredients/search', {
      params: { q: query },
    });
    return data;
  },
};

export const shoppingListApi = {
  list: async (): Promise<ShoppingList[]> => {
    const { data } = await api.get<ShoppingList[]>('/shopping-lists');
    return data;
  },
  get: async (id: string): Promise<ShoppingList> => {
    const { data } = await api.get<ShoppingList>(`/shopping-lists/${id}`);
    return data;
  },
  generate: async (payload: { name: string; recipeIds: string[]; excludeAllergens?: string[] }): Promise<ShoppingList> => {
    const { data } = await api.post<ShoppingList>('/shopping-lists', payload);
    return data;
  },
  toggleItem: async (listId: string, itemId: string): Promise<ShoppingListItem> => {
    const { data } = await api.patch<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}/toggle`);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/shopping-lists/${id}`);
  },
};

export const menuPlanApi = {
  list: async (): Promise<MenuPlan[]> => {
    const { data } = await api.get<MenuPlan[]>('/menu-plans');
    return data;
  },
  get: async (id: string): Promise<MenuPlan> => {
    const { data } = await api.get<MenuPlan>(`/menu-plans/${id}`);
    return data;
  },
  create: async (payload: { name: string; startDate: string; endDate: string }): Promise<MenuPlan> => {
    const { data } = await api.post<MenuPlan>('/menu-plans', payload);
    return data;
  },
  addItem: async (planId: string, item: { recipeId: string; date: string; mealType: MealType; servings?: number }): Promise<MenuPlan> => {
    const { data } = await api.post<MenuPlan>(`/menu-plans/${planId}/items`, item);
    return data;
  },
  removeItem: async (planId: string, itemId: string): Promise<MenuPlan> => {
    const { data } = await api.delete<MenuPlan>(`/menu-plans/${planId}/items/${itemId}`);
    return data;
  },
  generateShoppingList: async (planId: string): Promise<ShoppingList> => {
    const { data } = await api.post<ShoppingList>(`/menu-plans/${planId}/shopping-list`);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/menu-plans/${id}`);
  },
};

export interface UserListItem {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  _count: { recipes: number; followers: number };
}

export const userApi = {
  list: async (search?: string): Promise<UserListItem[]> => {
    const { data } = await api.get<UserListItem[]>('/users', {
      params: search ? { search } : undefined,
    });
    return data;
  },
};

export const followApi = {
  getStatus: async (userId: string): Promise<{ following: boolean }> => {
    const { data } = await api.get<{ following: boolean }>(`/users/${userId}/follow`);
    return data;
  },
  toggle: async (userId: string): Promise<{ following: boolean }> => {
    const { data } = await api.post<{ following: boolean }>(`/users/${userId}/follow`);
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
