import type { IngredientFormItem, StepFormItem } from '../../types';

export interface IngredientFormItemWithId extends IngredientFormItem {
  id: string;
}

export interface StepFormItemWithId extends StepFormItem {
  id: string;
}
