import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useRecipes } from '../hooks/useRecipes';
import { useGenerateShoppingList } from '../hooks/useShoppingLists';
import type { Allergen } from '../types';

const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: 'GLUTEN', label: 'Glutén' },
  { value: 'DAIRY', label: 'Tejtermék' },
  { value: 'EGG', label: 'Tojás' },
  { value: 'NUT', label: 'Dióféle' },
  { value: 'PEANUT', label: 'Mogyoró' },
  { value: 'SOY', label: 'Szója' },
  { value: 'FISH', label: 'Hal' },
  { value: 'SHELLFISH', label: 'Rák/Kagyló' },
  { value: 'SESAME', label: 'Szezám' },
  { value: 'CELERY', label: 'Zeller' },
  { value: 'MUSTARD', label: 'Mustár' },
  { value: 'SULPHITE', label: 'Szulfit' },
];

export default function CreateShoppingListPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [excludeAllergens, setExcludeAllergens] = useState<Allergen[]>([]);

  const { data: recipesData, isLoading } = useRecipes({ search, limit: 50 });
  const generateMutation = useGenerateShoppingList();

  const toggleRecipe = (id: string) => {
    setSelectedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleAllergen = (a: Allergen) => {
    setExcludeAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || selectedRecipeIds.length === 0) return;
    const payload = {
      name: name.trim(),
      recipeIds: selectedRecipeIds,
      ...(excludeAllergens.length > 0 ? { excludeAllergens } : {}),
    };
    generateMutation.mutate(payload, {
      onSuccess: (list) => navigate(`/bevasarlolista/${list.id}`),
      onError: (err) => console.error('Shopping list generation failed:', err),
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/bevasarlolista"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vissza a listákhoz
        </Link>

        <h1 className="text-2xl font-bold text-text mb-6">Bevásárlólista készítése</h1>

        {/* List name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-1">Lista neve</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="pl. Hétvégi bevásárlás"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Allergen filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-2">Allergének kizárása</label>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleAllergen(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  excludeAllergens.includes(opt.value)
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Receptek kiválasztása</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Recept keresése..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Recipe list */}
        <div className="card p-4 mb-6 max-h-80 overflow-y-auto space-y-1">
          {isLoading && <LoadingSpinner />}
          {recipesData?.data.map((recipe) => (
            <label
              key={recipe.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRecipeIds.includes(recipe.id)}
                onChange={() => toggleRecipe(recipe.id)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-sm text-text">{recipe.title}</span>
            </label>
          ))}
          {recipesData && recipesData.data.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-4">Nincs találat.</p>
          )}
        </div>

        {/* Error */}
        {generateMutation.isError && (
          <p className="text-sm text-red-600 mb-2">
            Hiba történt a lista generálásakor. Kérjük, próbáld újra.
          </p>
        )}

        {/* Selected count + submit */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {selectedRecipeIds.length} recept kiválasztva
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || selectedRecipeIds.length === 0 || generateMutation.isPending}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {generateMutation.isPending ? 'Generálás...' : 'Lista generálása'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
