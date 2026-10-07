import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CreateRecipeDto, DietaryTag, Difficulty, Recipe, RecipeImportDraft } from '../../types';
import IngredientInput from './IngredientInput';
import StepInput from './StepInput';
import ErrorMessage from '../common/ErrorMessage';
import ImageUpload from '../upload/ImageUpload';
import { isValidImageUrl } from '../../utils/imageUrl';
import { genId } from '../../utils/id';
import { categoryApi } from '../../services/api';
import type { IngredientFormItemWithId, StepFormItemWithId } from './formTypes';

const DIETARY_TAGS: { value: DietaryTag; label: string }[] = [
  { value: 'VEGETARIAN', label: 'Vegetáriánus' },
  { value: 'VEGAN', label: 'Vegán' },
  { value: 'GLUTEN_FREE', label: 'Gluténmentes' },
  { value: 'DAIRY_FREE', label: 'Tejmentes' },
  { value: 'LOW_CARB', label: 'Alacsony szénhidrát' },
  { value: 'KETO', label: 'Keto' },
  { value: 'PALEO', label: 'Paleo' },
  { value: 'NUT_FREE', label: 'Diómentes' },
];

interface RecipeFormProps {
  initialValues?: Recipe;
  /** Importált vázlat (pl. Instagram) — előre kitölti az űrlapot új recept esetén */
  initialDraft?: RecipeImportDraft;
  onSubmit: (data: CreateRecipeDto) => void;
  isLoading: boolean;
}

function initIngredients(recipe?: Recipe, draft?: RecipeImportDraft): IngredientFormItemWithId[] {
  if (recipe && recipe.ingredients.length > 0) {
    return recipe.ingredients.map((ing) => ({
      id: genId(),
      ingredientName: ing.ingredient.name,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes ?? undefined,
      isOptional: ing.isOptional,
    }));
  }
  if (draft && draft.ingredients.length > 0) {
    return draft.ingredients.map((ing) => ({
      id: genId(),
      ingredientName: ing.name,
      quantity: ing.quantity ?? 0,
      unit: ing.unit,
      notes: ing.notes ?? undefined,
      isOptional: false,
    }));
  }
  return [{ id: genId(), ingredientName: '', quantity: 0, unit: '', isOptional: false }];
}

function initSteps(recipe?: Recipe, draft?: RecipeImportDraft): StepFormItemWithId[] {
  if (recipe && recipe.steps.length > 0) {
    return recipe.steps
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((s) => ({
        id: genId(),
        stepNumber: s.stepNumber,
        instruction: s.instruction,
      }));
  }
  if (draft && draft.steps.length > 0) {
    return draft.steps.map((instruction, i) => ({
      id: genId(),
      stepNumber: i + 1,
      instruction,
    }));
  }
  return [{ id: genId(), stepNumber: 1, instruction: '' }];
}

export default function RecipeForm({ initialValues, initialDraft, onSubmit, isLoading }: RecipeFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? initialDraft?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? initialDraft?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '');
  const [cookingTime, setCookingTime] = useState<number | ''>(initialValues?.cookingTime ?? initialDraft?.cookingTime ?? '');
  const [servings, setServings] = useState<number | ''>(initialValues?.servings || initialDraft?.servings || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialValues?.difficulty ?? initialDraft?.difficulty ?? 'MEDIUM');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(initialValues?.dietaryTags ?? []);
  const [categoryIds, setCategoryIds] = useState<string[]>(
    () => initialValues?.categories?.map((c) => c.categoryId) ?? [],
  );
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
    staleTime: 1000 * 60 * 60,
  });

  const toggleCategory = (id: string) =>
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const toggleDietaryTag = (tag: DietaryTag) =>
    setDietaryTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  const [ingredients, setIngredients] = useState<IngredientFormItemWithId[]>(() => initIngredients(initialValues, initialDraft));
  const [steps, setSteps] = useState<StepFormItemWithId[]>(() => initSteps(initialValues, initialDraft));
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
      dietaryTags,
      categoryIds,
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
    'input w-full';

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

      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Recept képe"
      />

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

      <div>
        <span className="block text-sm font-medium text-text mb-2">Kategóriák</span>
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => {
            const selected = categoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
                  selected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
          {!categories?.length && (
            <span className="text-sm text-text-secondary">Kategóriák betöltése...</span>
          )}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-text mb-2">Étrendi jelölések</span>
        <div className="flex flex-wrap gap-2">
          {DIETARY_TAGS.map((tag) => {
            const selected = dietaryTags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleDietaryTag(tag.value)}
                className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
                  selected
                    ? 'bg-secondary border-secondary text-white'
                    : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
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
