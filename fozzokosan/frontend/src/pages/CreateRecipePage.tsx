import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RecipeForm from '../components/recipe/RecipeForm';
import ErrorMessage from '../components/common/ErrorMessage';
import { useCreateRecipe } from '../hooks/useRecipes';
import type { CreateRecipeDto } from '../types';

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const createMutation = useCreateRecipe();

  const handleSubmit = (data: CreateRecipeDto) => {
    createMutation.mutate(data, {
      onSuccess: (recipe) => {
        navigate(`/receptek/${recipe.id}`);
      },
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-text mb-8">Új recept létrehozása</h1>

          {createMutation.isError && (
            <div className="mb-6">
              <ErrorMessage message="Hiba történt a recept mentésekor. Kérjük, próbáld újra." />
            </div>
          )}

          <RecipeForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </div>
      </div>
    </Layout>
  );
}
