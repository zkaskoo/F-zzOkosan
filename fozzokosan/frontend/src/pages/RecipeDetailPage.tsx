import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Edit, Trash2, Users } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useRecipe, useDeleteRecipe } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import { isValidImageUrl } from '../utils/imageUrl';
import LikeButton from '../components/recipe/LikeButton';
import CommentSection from '../components/recipe/CommentSection';

const difficultyLabels = {
  EASY: { label: 'Könnyű', classes: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'Közepes', classes: 'bg-yellow-100 text-yellow-700' },
  HARD: { label: 'Nehéz', classes: 'bg-red-100 text-red-700' },
} as const;

function formatCookingTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} óra ${mins} perc` : `${hours} óra`;
  }
  return `${minutes} perc`;
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const deleteMutation = useDeleteRecipe();
  const user = useAuthStore((s) => s.user);

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
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Users className="h-4 w-4" />
                {recipe.servings} adag
              </span>
            )}
          </div>

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
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.id} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-text">
                        <span className="font-medium">{ing.quantity} {ing.unit}</span>{' '}
                        {ing.name}
                        {ing.isOptional && (
                          <span className="text-text-secondary ml-1">(opcionális)</span>
                        )}
                        {ing.notes && (
                          <span className="text-text-secondary ml-1">- {ing.notes}</span>
                        )}
                      </span>
                    </li>
                  ))}
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
