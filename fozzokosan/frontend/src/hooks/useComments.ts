import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../services/api';

export function useComments(recipeId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['comments', recipeId, page],
    queryFn: () => commentApi.list(recipeId!, page),
    enabled: !!recipeId,
  });
}

export function useCreateComment(recipeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => commentApi.create(recipeId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useDeleteComment(recipeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.delete(recipeId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
    },
  });
}
