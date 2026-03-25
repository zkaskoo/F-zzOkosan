import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { likeApi } from '../services/api';

export function useLikeStatus(recipeId: string | undefined) {
  return useQuery({
    queryKey: ['likes', recipeId],
    queryFn: () => likeApi.getStatus(recipeId!),
    enabled: !!recipeId,
  });
}

export function useToggleLike(recipeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeApi.toggle(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
