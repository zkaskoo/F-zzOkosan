import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useShoppingList, useToggleShoppingItem, useDeleteShoppingList } from '../hooks/useShoppingLists';

export default function ShoppingListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: list, isLoading, isError } = useShoppingList(id);
  const toggleMutation = useToggleShoppingItem();
  const deleteMutation = useDeleteShoppingList();

  const handleToggle = (itemId: string) => {
    if (!id) return;
    toggleMutation.mutate({ listId: id, itemId });
  };

  const handleDelete = () => {
    if (!id) return;
    if (!window.confirm('Biztosan törlöd ezt a bevásárlólistát?')) return;
    deleteMutation.mutate(id, { onSuccess: () => navigate('/bevasarlolista') });
  };

  if (isLoading) return <Layout><LoadingSpinner size="lg" /></Layout>;
  if (isError || !list) return <Layout><ErrorMessage message="A lista nem található." /></Layout>;

  const unchecked = list.items.filter((i) => !i.isChecked);
  const checked = list.items.filter((i) => i.isChecked);

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/bevasarlolista"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vissza a listákhoz
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">{list.name}</h1>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 text-sm transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Törlés
          </button>
        </div>

        <div className="card p-6 space-y-2">
          {unchecked.length === 0 && checked.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-4">A lista üres.</p>
          )}
          {unchecked.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={false}
                onChange={() => handleToggle(item.id)}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="flex-1 text-sm text-text">
                <span className="font-medium">{item.quantity} {item.unit}</span>{' '}
                {item.ingredientName}
              </span>
            </label>
          ))}

          {checked.length > 0 && unchecked.length > 0 && (
            <hr className="my-3 border-gray-200" />
          )}

          {checked.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors opacity-50"
            >
              <input
                type="checkbox"
                checked={true}
                onChange={() => handleToggle(item.id)}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="flex-1 text-sm text-text line-through">
                <span className="font-medium">{item.quantity} {item.unit}</span>{' '}
                {item.ingredientName}
              </span>
            </label>
          ))}
        </div>
      </div>
    </Layout>
  );
}
