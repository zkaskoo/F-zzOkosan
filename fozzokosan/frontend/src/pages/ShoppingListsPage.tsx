import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useShoppingLists, useDeleteShoppingList } from '../hooks/useShoppingLists';

export default function ShoppingListsPage() {
  const { data: lists, isLoading, isError } = useShoppingLists();
  const deleteMutation = useDeleteShoppingList();

  const handleDelete = (id: string) => {
    if (!window.confirm('Biztosan törlöd ezt a bevásárlólistát?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text">Bevásárlólistáim</h1>
          <Link
            to="/bevasarlolista/uj"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Új lista
          </Link>
        </div>

        {isLoading && <LoadingSpinner size="lg" />}
        {isError && <ErrorMessage message="Nem sikerült betölteni a listákat." />}

        {lists && lists.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>Még nincs bevásárlólistád.</p>
            <p className="text-sm mt-1">Hozz létre egyet a receptjeidből!</p>
          </div>
        )}

        <div className="space-y-3">
          {lists?.map((list) => {
            const checkedCount = list.items.filter((i) => i.isChecked).length;
            const totalCount = list.items.length;
            return (
              <div key={list.id} className="card p-4 flex items-center justify-between">
                <Link to={`/bevasarlolista/${list.id}`} className="flex-1 min-w-0">
                  <h2 className="font-semibold text-text truncate">{list.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{checkedCount}/{totalCount} kész</span>
                    <span className="text-xs">
                      {new Date(list.createdAt).toLocaleDateString('hu-HU')}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(list.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Lista törlése"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
