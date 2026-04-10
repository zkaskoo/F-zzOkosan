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
  quantity: number;
  unit: string;
  normalizedQuantity: number | null;
  normalizedUnit: string | null;
  notes: string | null;
  isOptional: boolean;
  ingredient: {
    id: string;
    name: string;
    normalizedName: string;
    category: string;
  };
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
  ingredientName: string;
  quantity: number;
  unit: string;
  notes?: string;
  isOptional?: boolean;
}

export interface StepFormItem {
  stepNumber: number;
  instruction: string;
}

export type DietaryTag = 'VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'DAIRY_FREE' | 'KETO' | 'PALEO' | 'LOW_CARB' | 'NUT_FREE';
export type Allergen = 'GLUTEN' | 'DAIRY' | 'EGG' | 'NUT' | 'PEANUT' | 'SOY' | 'FISH' | 'SHELLFISH' | 'SESAME' | 'CELERY' | 'MUSTARD' | 'SULPHITE';

export interface ShoppingListItem {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
  sourceRecipes: string[];
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: ShoppingListItem[];
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MenuItem {
  id: string;
  recipeId: string;
  date: string;
  mealType: MealType;
  servings: number;
  recipe: {
    id: string;
    title: string;
    imageUrl: string | null;
    cookingTime: number | null;
    servings: number;
  };
}

export interface MenuPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  items: MenuItem[];
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

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  recipeId: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface LikeStatus {
  count: number;
  liked: boolean;
}
