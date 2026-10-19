import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useShoppingList, useToggleShoppingItem, useDeleteShoppingList } from '../hooks/useShoppingLists';
import { classifyShoppingItem } from '../constants/pantry';

interface ShoppingItem {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

function ItemRow({
  item,
  onToggle,
  showQuantity = true,
  pantry = false,
}: {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  showQuantity?: boolean;
  pantry?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
        item.isChecked ? 'opacity-50' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={() => onToggle(item.id)}
        className="h-5 w-5 rounded accent-primary"
      />
      <span className={`flex-1 text-sm text-text ${item.isChecked ? 'line-through' : ''}`}>
        {showQuantity && item.quantity > 0 && (
          <span className="font-medium">{item.quantity} {item.unit} </span>
        )}
        {item.ingredientName}
        {pantry && (
          <span className="ml-2 text-xs text-text-secondary">(otthon van?)</span>
        )}
      </span>
    </label>
  );
}

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

  // A tételeket három csoportba soroljuk: megveendő, fűszer, kamra-alap.
  const seasonings: ShoppingItem[] = [];
  const mainItems: ShoppingItem[] = [];
  for (const item of list.items) {
    if (classifyShoppingItem(item.ingredientName) === 'seasoning') {
      seasonings.push(item);
    } else {
      mainItems.push(item);
    }
  }
  const isPantry = (item: ShoppingItem) =>
    classifyShoppingItem(item.ingredientName) === 'pantry';

  // Megveendő tételek: a bepipáltak a lista aljára, áthúzva.
  const mainSorted = [...mainItems].sort(
    (a, b) => Number(a.isChecked) - Number(b.isChecked),
  );
  const seasoningSorted = [...seasonings].sort(
    (a, b) => Number(a.isChecked) - Number(b.isChecked),
  );

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
          {list.items.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-4">A lista üres.</p>
          )}
          {mainSorted.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={handleToggle}
              pantry={isPantry(item)}
              // A kamra-alapoknál (só, olaj, cukor) a mennyiség nem informatív.
              showQuantity={!isPantry(item)}
            />
          ))}
        </div>

        {seasoningSorted.length > 0 && (
          <div className="card p-6 space-y-2 mt-4">
            <p className="text-sm font-semibold text-text mb-1">Fűszerek (ízlés szerint)</p>
            <p className="text-xs text-text-secondary mb-2">
              Ezeket mennyiség nélkül soroljuk fel – általában ízlés szerint adagolod.
            </p>
            {seasoningSorted.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                showQuantity={false}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
