import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useRecipes } from '../hooks/useRecipes';
import { categoryApi, type Category } from '../services/api';

export default function RecipeListPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 12;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 300_000,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isError } = useRecipes({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    setPage(1);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-text">Receptek</h1>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Keresés..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat: Category) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-primary border-primary text-white'
                      : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : isError ? (
            <ErrorMessage message="Hiba történt a receptek betöltésekor." />
          ) : data && data.data.length > 0 ? (
            <>
              <p className="text-sm text-text-secondary mb-6">
                {data.total} recept található
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.data.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page <= 1}
                    className="btn-secondary disabled:opacity-40"
                  >
                    Előző
                  </button>
                  <span className="text-sm text-text-secondary">
                    {page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.totalPages}
                    className="btn-primary disabled:opacity-40"
                  >
                    Következő
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-text-secondary mb-4">Nincs találat</p>
              <p className="text-sm text-text-secondary mb-6">
                Még nincsenek receptek, vagy a keresés nem adott eredményt.
              </p>
              <Link to="/receptek/uj" className="btn-primary">
                Első recept létrehozása
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
