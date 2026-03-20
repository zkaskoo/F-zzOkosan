import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RecipeForm from '../components/recipe/RecipeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useRecipe, useUpdateRecipe } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import type { CreateRecipeDto } from '../types';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const updateMutation = useUpdateRecipe();
  const user = useAuthStore((s) => s.user);

  const handleSubmit = (data: CreateRecipeDto) => {
    if (!id) return;
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate(`/receptek/${id}`);
        },
      },
    );
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
        </div>
      </Layout>
    );
  }

  if (recipe && user?.id !== recipe.userId) {
    return <Navigate to={`/receptek/${id}`} replace />;
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-text mb-8">Recept szerkesztése</h1>

          {updateMutation.isError && (
            <div className="mb-6">
              <ErrorMessage message="Hiba történt a módosítások mentésekor." />
            </div>
          )}

          <RecipeForm
            key={recipe.id}
            initialValues={recipe}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </Layout>
  );
}
