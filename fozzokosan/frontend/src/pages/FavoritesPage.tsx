import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import Layout from '../components/layout/Layout';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritesPage() {
  const { data: recipes, isLoading, isError } = useFavorites();

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="page-container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-text">Kedvenceim</h1>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : isError ? (
            <ErrorMessage message="Hiba történt a kedvencek betöltésekor." />
          ) : recipes && recipes.length > 0 ? (
            <>
              <p className="text-sm text-text-secondary mb-6">
                {recipes.length} mentett recept
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-text-secondary mb-4">
                Még nincsenek mentett receptjeid
              </p>
              <p className="text-sm text-text-secondary mb-6">
                A receptek oldalán a könyvjelző ikonnal mentheted a kedvenceidet.
              </p>
              <Link to="/receptek" className="btn-primary">
                Receptek böngészése
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
