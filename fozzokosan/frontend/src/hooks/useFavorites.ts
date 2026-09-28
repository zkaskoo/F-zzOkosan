import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteApi } from '../services/api';

export function useFavoriteStatus(recipeId: string | undefined) {
  return useQuery({
    queryKey: ['favorite', recipeId],
    queryFn: () => favoriteApi.getStatus(recipeId!),
    enabled: !!recipeId,
  });
}

export function useToggleFavorite(recipeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => favoriteApi.toggle(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteApi.list(),
  });
}
