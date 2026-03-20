import { useEffect, useState } from 'react';
import type { CreateRecipeDto, Difficulty, IngredientFormItem, Recipe, StepFormItem } from '../../types';
import IngredientInput from './IngredientInput';
import StepInput from './StepInput';
import ErrorMessage from '../common/ErrorMessage';

interface RecipeFormProps {
  initialValues?: Recipe;
  onSubmit: (data: CreateRecipeDto) => void;
  isLoading: boolean;
}

const emptyIngredient: IngredientFormItem = { name: '', quantity: 0, unit: '', isOptional: false };
const emptyStep: StepFormItem = { stepNumber: 1, instruction: '' };

export default function RecipeForm({ initialValues, onSubmit, isLoading }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [cookingTime, setCookingTime] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [isPublic, setIsPublic] = useState(true);
  const [ingredients, setIngredients] = useState<IngredientFormItem[]>([{ ...emptyIngredient }]);
  const [steps, setSteps] = useState<StepFormItem[]>([{ ...emptyStep }]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description ?? '');
      setImageUrl(initialValues.imageUrl ?? '');
      setCookingTime(initialValues.cookingTime ?? '');
      setServings(initialValues.servings || '');
      setDifficulty(initialValues.difficulty);
      setIsPublic(initialValues.isPublic);
      setIngredients(
        initialValues.ingredients.length > 0
          ? initialValues.ingredients.map((ing) => ({
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes ?? undefined,
              isOptional: ing.isOptional,
            }))
          : [{ ...emptyIngredient }],
      );
      setSteps(
        initialValues.steps.length > 0
          ? initialValues.steps
              .sort((a, b) => a.stepNumber - b.stepNumber)
              .map((s) => ({ stepNumber: s.stepNumber, instruction: s.instruction }))
          : [{ ...emptyStep }],
      );
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('A recept neve kötelező.');
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
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
      imageUrl: imageUrl.trim() || undefined,
      cookingTime: cookingTime ? Number(cookingTime) : undefined,
      servings: servings ? Number(servings) : undefined,
      difficulty,
      isPublic,
      ingredients: validIngredients,
      steps: validSteps.map((s, i) => ({ ...s, stepNumber: i + 1 })),
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div>
        <label className="block text-sm font-medium text-text mb-1">Recept neve *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Pl. Gulyásleves"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Leírás</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rövid leírás a receptről..."
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Kép URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/kep.jpg"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Főzési idő (perc)</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value ? parseInt(e.target.value) : '')}
            min={1}
            placeholder="30"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Adagok száma</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : '')}
            min={1}
            placeholder="4"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Nehézség</label>
          <select
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

      <label className="flex items-center gap-2 text-sm text-text">
        <input
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
