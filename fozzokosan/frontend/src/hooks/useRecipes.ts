import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipeApi } from '../services/api';
import type { RecipeListParams } from '../services/api';
import type { CreateRecipeDto } from '../types';

export function useRecipes(params?: RecipeListParams) {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => recipeApi.list(params),
    staleTime: 60_000,
  });
}

export function useRecipe(id: string | undefined) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeApi.get(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipeDto) => recipeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRecipeDto> }) =>
      recipeApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
