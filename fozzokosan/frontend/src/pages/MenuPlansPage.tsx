import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Trash2, Plus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useMenuPlans, useCreateMenuPlan, useDeleteMenuPlan } from '../hooks/useMenuPlans';

function getNextMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function MenuPlansPage() {
  const navigate = useNavigate();
  const { data: plans, isLoading, isError } = useMenuPlans();
  const createMutation = useCreateMenuPlan();
  const deleteMutation = useDeleteMenuPlan();

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(getNextMonday);

  const handleCreate = () => {
    if (!name.trim() || !startDate) return;
    createMutation.mutate(
      { name: name.trim(), startDate, endDate: addDays(startDate, 6) },
      {
        onSuccess: (plan) => {
          setShowCreate(false);
          setName('');
          navigate(`/etlapterv/${plan.id}`);
        },
        onError: (err) => console.error('Menu plan creation failed:', err),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Biztosan törlöd ezt az étlaptervet?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text">Étlapterveim</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Új terv
          </button>
        </div>

        {showCreate && (
          <div className="card p-4 mb-6 space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pl. Jövő heti menü"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary">Kezdés:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!name.trim() || createMutation.isPending}
                className="btn-primary text-sm disabled:opacity-50 ml-auto"
              >
                Létrehozás
              </button>
            </div>
            {createMutation.isError && (
              <p className="text-sm text-red-600">Hiba történt a létrehozáskor. Kérjük, próbáld újra.</p>
            )}
          </div>
        )}

        {isLoading && <LoadingSpinner size="lg" />}
        {isError && <ErrorMessage message="Nem sikerült betölteni az étlapterveket." />}

        {plans && plans.length === 0 && !showCreate && (
          <div className="text-center py-12 text-text-secondary">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>Még nincs étlapterved.</p>
            <p className="text-sm mt-1">Tervezd meg a heted!</p>
          </div>
        )}

        <div className="space-y-3">
          {plans?.map((plan) => (
            <div key={plan.id} className="card p-4 flex items-center justify-between">
              <Link to={`/etlapterv/${plan.id}`} className="flex-1 min-w-0">
                <h2 className="font-semibold text-text truncate">{plan.name}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {new Date(plan.startDate).toLocaleDateString('hu-HU')} - {new Date(plan.endDate).toLocaleDateString('hu-HU')}
                  <span className="ml-2">{plan.items.length} étel</span>
                </p>
              </Link>
              <button
                onClick={() => handleDelete(plan.id)}
                disabled={deleteMutation.isPending}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                aria-label="Terv törlése"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
