import { useState } from 'react';
import type { CreateRecipeDto, Difficulty, Recipe } from '../../types';
import IngredientInput from './IngredientInput';
import StepInput from './StepInput';
import ErrorMessage from '../common/ErrorMessage';
import { isValidImageUrl } from '../../utils/imageUrl';
import type { IngredientFormItemWithId, StepFormItemWithId } from './formTypes';

interface RecipeFormProps {
  initialValues?: Recipe;
  onSubmit: (data: CreateRecipeDto) => void;
  isLoading: boolean;
}

function initIngredients(recipe?: Recipe): IngredientFormItemWithId[] {
  if (recipe && recipe.ingredients.length > 0) {
    return recipe.ingredients.map((ing) => ({
      id: crypto.randomUUID(),
      ingredientName: ing.ingredient.name,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes ?? undefined,
      isOptional: ing.isOptional,
    }));
  }
  return [{ id: crypto.randomUUID(), ingredientName: '', quantity: 0, unit: '', isOptional: false }];
}

function initSteps(recipe?: Recipe): StepFormItemWithId[] {
  if (recipe && recipe.steps.length > 0) {
    return recipe.steps
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((s) => ({
        id: crypto.randomUUID(),
        stepNumber: s.stepNumber,
        instruction: s.instruction,
      }));
  }
  return [{ id: crypto.randomUUID(), stepNumber: 1, instruction: '' }];
}

export default function RecipeForm({ initialValues, onSubmit, isLoading }: RecipeFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '');
  const [cookingTime, setCookingTime] = useState<number | ''>(initialValues?.cookingTime ?? '');
  const [servings, setServings] = useState<number | ''>(initialValues?.servings || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialValues?.difficulty ?? 'MEDIUM');
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);
  const [ingredients, setIngredients] = useState<IngredientFormItemWithId[]>(() => initIngredients(initialValues));
  const [steps, setSteps] = useState<StepFormItemWithId[]>(() => initSteps(initialValues));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('A recept neve kötelező.');
      return;
    }

    const trimmedImageUrl = imageUrl.trim();
    if (trimmedImageUrl && !isValidImageUrl(trimmedImageUrl)) {
      setError('Érvénytelen kép URL');
      return;
    }

    const validIngredients = ingredients.filter((i) => (i.ingredientName ?? '').trim());
    if (validIngredients.length === 0) {
      setError('Legalább egy hozzávalót adj meg.');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim());
    if (validSteps.length === 0) {
      setError('Legalább egy elkészítési lépést adj meg.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      imageUrl: trimmedImageUrl || undefined,
      cookingTime: cookingTime ? Number(cookingTime) : undefined,
      servings: servings ? Number(servings) : undefined,
      difficulty,
      isPublic,
      ingredients: validIngredients.map((item) => ({
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
        isOptional: item.isOptional,
      })),
      steps: validSteps.map((item, i) => ({
        stepNumber: i + 1,
        instruction: item.instruction,
      })),
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div>
        <label htmlFor="recipe-title" className="block text-sm font-medium text-text mb-1">Recept neve *</label>
        <input
          id="recipe-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Pl. Gulyásleves"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="recipe-description" className="block text-sm font-medium text-text mb-1">Leírás</label>
        <textarea
          id="recipe-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rövid leírás a receptről..."
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="recipe-image-url" className="block text-sm font-medium text-text mb-1">Kép URL</label>
        <input
          id="recipe-image-url"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/kep.jpg"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="recipe-cooking-time" className="block text-sm font-medium text-text mb-1">Főzési idő (perc)</label>
          <input
            id="recipe-cooking-time"
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value ? parseInt(e.target.value) : '')}
            min={1}
            placeholder="30"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="recipe-servings" className="block text-sm font-medium text-text mb-1">Adagok száma</label>
          <input
            id="recipe-servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : '')}
            min={1}
            placeholder="4"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="recipe-difficulty" className="block text-sm font-medium text-text mb-1">Nehézség</label>
          <select
            id="recipe-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className={inputClass}
          >
            <option value="EASY">Könnyű</option>
            <option value="MEDIUM">Közepes</option>
            <option value="HARD">Nehéz</option>
          </select>
        </div>
      </div>

      <label htmlFor="recipe-is-public" className="flex items-center gap-2 text-sm text-text">
        <input
          id="recipe-is-public"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded accent-primary"
        />
        Nyilvános recept
      </label>

      <hr className="border-gray-200" />

      <IngredientInput ingredients={ingredients} onChange={setIngredients} />

      <hr className="border-gray-200" />

      <StepInput steps={steps} onChange={setSteps} />

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full sm:w-auto"
        >
          {isLoading
            ? 'Mentés...'
            : initialValues
              ? 'Változások mentése'
              : 'Mentés'}
        </button>
      </div>
    </form>
  );
}
