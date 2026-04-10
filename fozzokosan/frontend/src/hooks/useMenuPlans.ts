import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuPlanApi } from '../services/api';
import type { MealType } from '../types';

export function useMenuPlans() {
  return useQuery({
    queryKey: ['menu-plans'],
    queryFn: () => menuPlanApi.list(),
  });
}

export function useMenuPlan(id: string | undefined) {
  return useQuery({
    queryKey: ['menu-plan', id],
    queryFn: () => menuPlanApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateMenuPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; startDate: string; endDate: string }) =>
      menuPlanApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-plans'] });
    },
  });
}

export function useAddMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      ...item
    }: {
      planId: string;
      recipeId: string;
      date: string;
      mealType: MealType;
      servings?: number;
    }) => menuPlanApi.addItem(planId, item),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu-plan', variables.planId] });
    },
  });
}

export function useRemoveMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, itemId }: { planId: string; itemId: string }) =>
      menuPlanApi.removeItem(planId, itemId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu-plan', variables.planId] });
    },
  });
}

export function useGenerateMenuShoppingList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => menuPlanApi.generateShoppingList(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });
}

export function useDeleteMenuPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuPlanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-plans'] });
    },
  });
}
