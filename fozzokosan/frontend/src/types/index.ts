export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string | null;
  isOptional: boolean;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  cookingTime: number | null;
  servings: number;
  difficulty: Difficulty;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  _count?: { likes: number; comments: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  imageUrl?: string;
  cookingTime?: number;
  servings?: number;
  difficulty?: Difficulty;
  isPublic?: boolean;
  ingredients: IngredientFormItem[];
  steps: StepFormItem[];
}

export interface IngredientFormItem {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  isOptional?: boolean;
}

export interface StepFormItem {
  stepNumber: number;
  instruction: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
