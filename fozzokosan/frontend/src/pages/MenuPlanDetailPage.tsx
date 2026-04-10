import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart, Trash2, X, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  useMenuPlan,
  useAddMenuItem,
  useRemoveMenuItem,
  useGenerateMenuShoppingList,
  useDeleteMenuPlan,
} from '../hooks/useMenuPlans';
import { useRecipes } from '../hooks/useRecipes';
import type { MealType, MenuItem } from '../types';

const DAY_NAMES = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Reggeli' },
  { value: 'LUNCH', label: 'Ebéd' },
  { value: 'DINNER', label: 'Vacsora' },
  { value: 'SNACK', label: 'Snack' },
];

function getDaysInRange(start: string, end: string): string[] {
  const days: string[] = [];
  const d = new Date(start);
  const endDate = new Date(end);
  while (d <= endDate) {
    days.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function getItemsForDayMeal(items: MenuItem[], day: string, mealType: MealType) {
  return items.filter(
    (item) => item.date.startsWith(day) && item.mealType === mealType,
  );
}

export default function MenuPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plan, isLoading, isError } = useMenuPlan(id);
  const addMutation = useAddMenuItem();
  const removeMutation = useRemoveMenuItem();
  const shoppingListMutation = useGenerateMenuShoppingList();
  const deleteMutation = useDeleteMenuPlan();

  const [addingSlot, setAddingSlot] = useState<{ day: string; mealType: MealType } | null>(null);
  const [recipeSearch, setRecipeSearch] = useState('');
  const { data: recipesData } = useRecipes({ search: recipeSearch, limit: 20 });

  const handleAdd = (recipeId: string) => {
    if (!id || !addingSlot) return;
    addMutation.mutate(
      { planId: id, recipeId, date: addingSlot.day, mealType: addingSlot.mealType },
      { onSuccess: () => { setAddingSlot(null); setRecipeSearch(''); } },
    );
  };

  const handleRemove = (itemId: string) => {
    if (!id) return;
    removeMutation.mutate({ planId: id, itemId });
  };

  const handleGenerateList = () => {
    if (!id) return;
    shoppingListMutation.mutate(id, {
      onSuccess: (list) => navigate(`/bevasarlolista/${list.id}`),
    });
  };

  const handleDelete = () => {
    if (!id || !window.confirm('Biztosan törlöd ezt az étlaptervet?')) return;
    deleteMutation.mutate(id, { onSuccess: () => navigate('/etlapterv') });
  };

  if (isLoading) return <Layout><LoadingSpinner size="lg" /></Layout>;
  if (isError || !plan) return <Layout><ErrorMessage message="Az étlapterv nem található." /></Layout>;

  const days = getDaysInRange(plan.startDate, plan.endDate);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          to="/etlapterv"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vissza a tervekhez
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">{plan.name}</h1>
            <p className="text-sm text-text-secondary">
              {new Date(plan.startDate).toLocaleDateString('hu-HU')} - {new Date(plan.endDate).toLocaleDateString('hu-HU')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateList}
              disabled={plan.items.length === 0 || shoppingListMutation.isPending}
              className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {shoppingListMutation.isPending ? 'Generálás...' : 'Bevásárlólista'}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 text-sm transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Törlés
            </button>
          </div>
        </div>

        {/* Weekly grid */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {days.map((day, idx) => (
              <div key={day} className="space-y-2">
                <div className="text-center">
                  <p className="font-semibold text-text text-sm">{DAY_NAMES[idx] ?? ''}</p>
                  <p className="text-xs text-text-secondary">
                    {new Date(day).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {MEAL_TYPES.map((meal) => {
                  const cellItems = getItemsForDayMeal(plan.items, day, meal.value);
                  return (
                    <div key={meal.value} className="card p-2 min-h-[80px]">
                      <p className="text-xs font-medium text-text-secondary mb-1">{meal.label}</p>
                      {cellItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-primary/10 rounded px-2 py-1 mb-1"
                        >
                          <Link
                            to={`/receptek/${item.recipe.id}`}
                            className="text-xs text-text hover:text-primary truncate flex-1"
                          >
                            {item.recipe.title}
                          </Link>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-400 hover:text-red-600 ml-1 shrink-0"
                            aria-label="Eltávolítás"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAddingSlot({ day, mealType: meal.value })}
                        className="w-full text-xs text-primary/60 hover:text-primary py-0.5 transition-colors"
                      >
                        <Plus className="h-3 w-3 inline" /> Hozzáad
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Add recipe modal */}
        {addingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">Recept hozzáadása</h2>
                <button onClick={() => { setAddingSlot(null); setRecipeSearch(''); }}>
                  <X className="h-5 w-5 text-text-secondary" />
                </button>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Recept keresése..."
                  className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {recipesData?.data.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => handleAdd(recipe.id)}
                    disabled={addMutation.isPending}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {recipe.title}
                  </button>
                ))}
                {recipesData && recipesData.data.length === 0 && (
                  <p className="text-sm text-text-secondary text-center py-4">Nincs találat.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
