import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shoppingListApi } from '../services/api';

export function useShoppingLists() {
  return useQuery({
    queryKey: ['shopping-lists'],
    queryFn: () => shoppingListApi.list(),
  });
}

export function useShoppingList(id: string | undefined) {
  return useQuery({
    queryKey: ['shopping-list', id],
    queryFn: () => shoppingListApi.get(id!),
    enabled: !!id,
  });
}

export function useGenerateShoppingList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; recipeIds: string[]; excludeAllergens?: string[] }) =>
      shoppingListApi.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
}

export function useToggleShoppingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      shoppingListApi.toggleItem(listId, itemId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list', variables.listId] });
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
}

export function useDeleteShoppingList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shoppingListApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
}
