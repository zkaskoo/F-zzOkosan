import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Edit, Minus, Plus, Trash2, Users } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useRecipe, useDeleteRecipe } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import { isValidImageUrl } from '../utils/imageUrl';
import LikeButton from '../components/recipe/LikeButton';
import FavoriteButton from '../components/recipe/FavoriteButton';
import CommentSection from '../components/recipe/CommentSection';

const MAX_SERVINGS = 50;

const difficultyLabels = {
  EASY: { label: 'Könnyű', classes: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'Közepes', classes: 'bg-yellow-100 text-yellow-700' },
  HARD: { label: 'Nehéz', classes: 'bg-red-100 text-red-700' },
} as const;

const dietaryTagLabels: Record<string, string> = {
  VEGETARIAN: 'Vegetáriánus',
  VEGAN: 'Vegán',
  GLUTEN_FREE: 'Gluténmentes',
  DAIRY_FREE: 'Tejmentes',
  LOW_CARB: 'Alacsony szénhidrát',
  KETO: 'Keto',
  PALEO: 'Paleo',
  NUT_FREE: 'Diómentes',
};

function formatCookingTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} óra ${mins} perc` : `${hours} óra`;
  }
  return `${minutes} perc`;
}

/** Mennyiség formázása magyar tizedesvesszővel, felesleges nullák nélkül. */
function formatQuantity(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString('hu-HU', { maximumFractionDigits: 2 });
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const deleteMutation = useDeleteRecipe();
  const user = useAuthStore((s) => s.user);
  const [customServings, setCustomServings] = useState<number | null>(null);

  const isOwner = user && recipe && user.id === recipe.userId;

  const handleDelete = () => {
    if (!id) return;
    if (!window.confirm('Biztosan törlöd ezt a receptet?')) return;

    deleteMutation.mutate(id, {
      onSuccess: () => navigate('/receptek'),
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" />
      </Layout>
    );
  }

  if (isError || !recipe) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <ErrorMessage message="A recept nem található." />
          <Link to="/receptek" className="mt-4 inline-block text-primary hover:text-primary-dark text-sm font-medium">
            &larr; Vissza a receptekhez
          </Link>
        </div>
      </Layout>
    );
  }

  const difficulty = difficultyLabels[recipe.difficulty];
  const baseServings = recipe.servings > 0 ? recipe.servings : 1;
  const targetServings = customServings ?? baseServings;
  const scaleFactor = targetServings / baseServings;
  const isScaled = targetServings !== baseServings;

  const changeServings = (delta: number) => {
    setCustomServings((prev) => {
      const current = prev ?? baseServings;
      const next = Math.min(MAX_SERVINGS, Math.max(1, current + delta));
      return next;
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link */}
          <Link
            to="/receptek"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza a receptekhez
          </Link>

          {/* Cover image */}
          {isValidImageUrl(recipe.imageUrl) ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
            />
          ) : (
            <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-primary/60 to-yellow-400/60 rounded-2xl mb-8" />
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{recipe.title}</h1>
              {recipe.description && (
                <p className="text-text-secondary">{recipe.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <LikeButton recipeId={recipe.id} />
              <FavoriteButton recipeId={recipe.id} />
              {isOwner && (
                <>
                  <Link
                    to={`/receptek/${recipe.id}/szerkesztes`}
                    className="btn-secondary flex items-center gap-1.5 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Szerkesztés
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 text-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Törlés
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
            <span className={`rounded-full px-3 py-1 font-medium ${difficulty.classes}`}>
              {difficulty.label}
            </span>
            {recipe.cookingTime != null && (
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Clock className="h-4 w-4" />
                {formatCookingTime(recipe.cookingTime)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-text-secondary">
              <Users className="h-4 w-4" />
              {recipe.servings} adagra megadva
            </span>
          </div>

          {/* Kategóriák és étrendi jelölések */}
          {(recipe.categories?.length > 0 || recipe.dietaryTags?.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-8 text-sm">
              {recipe.categories?.map((c) => (
                <span
                  key={c.categoryId}
                  className="rounded-full px-3 py-1 font-medium bg-primary/10 text-primary"
                >
                  {c.category.name}
                </span>
              ))}
              {recipe.dietaryTags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 font-medium bg-secondary/10 text-secondary"
                >
                  {dietaryTagLabels[tag] ?? tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <Link to={`/profil/${recipe.user.id}`} className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {isValidImageUrl(recipe.user.avatar) ? (
                <img src={recipe.user.avatar} alt={recipe.user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                recipe.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-medium text-text text-sm">{recipe.user.name}</p>
              <p className="text-xs text-text-secondary">Szerző</p>
            </div>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-text mb-4">Hozzávalók</h2>

                {/* Adagszám-választó — a mennyiségek automatikusan átszámolódnak */}
                <div className="mb-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-text flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      Adagok
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeServings(-1)}
                        disabled={targetServings <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-text hover:bg-gray-100 transition-colors disabled:opacity-40"
                        aria-label="Kevesebb adag"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-base font-bold text-text tabular-nums">
                        {targetServings}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeServings(1)}
                        disabled={targetServings >= MAX_SERVINGS}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-text hover:bg-gray-100 transition-colors disabled:opacity-40"
                        aria-label="Több adag"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {isScaled && (
                    <button
                      type="button"
                      onClick={() => setCustomServings(null)}
                      className="mt-2 text-xs text-primary hover:text-primary-dark font-medium"
                    >
                      Vissza az eredeti {baseServings} adagra
                    </button>
                  )}
                </div>

                <ul className="space-y-2">
                  {recipe.ingredients.map((ing) => {
                    const amount = ing.quantity * scaleFactor;
                    // 0 (vagy hiányzó) mennyiség → "ízlés szerint"
                    const toTaste = !amount || amount <= 0;
                    const hasTasteNote = ing.notes
                      ? /ízl[eé]s szerint/i.test(ing.notes)
                      : false;
                    return (
                      <li key={ing.id} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-text">
                          {toTaste ? (
                            <>
                              {ing.ingredient.name}
                              <span className="text-text-secondary ml-1">– ízlés szerint</span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium">
                                {formatQuantity(amount)} {ing.unit}
                              </span>{' '}
                              {ing.ingredient.name}
                            </>
                          )}
                          {ing.isOptional && (
                            <span className="text-text-secondary ml-1">(opcionális)</span>
                          )}
                          {ing.notes && !(toTaste && hasTasteNote) && (
                            <span className="text-text-secondary ml-1">- {ing.notes}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Steps */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-text mb-4">Elkészítés</h2>
              <ol className="space-y-4">
                {recipe.steps
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((step) => (
                    <li key={step.id} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                        {step.stepNumber}
                      </span>
                      <p className="text-text text-sm leading-relaxed pt-1">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>

          {/* Comments */}
          <CommentSection recipeId={recipe.id} />
        </div>
      </div>
    </Layout>
  );
}
