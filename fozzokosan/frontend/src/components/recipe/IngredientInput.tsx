import { Trash2 } from 'lucide-react';
import type { IngredientFormItemWithId } from './formTypes';

interface IngredientInputProps {
  ingredients: IngredientFormItemWithId[];
  onChange: (ingredients: IngredientFormItemWithId[]) => void;
}

export default function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const handleChange = (id: string, field: keyof IngredientFormItemWithId, value: string | number | boolean) => {
    const updated = ingredients.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...ingredients, { id: crypto.randomUUID(), name: '', quantity: 0, unit: '', isOptional: false }]);
  };

  const handleRemove = (id: string) => {
    if (ingredients.length <= 1) return;
    onChange(ingredients.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Hozzávalók</label>
      {ingredients.map((item) => (
        <div key={item.id} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Hozzávaló neve"
            value={item.name}
            onChange={(e) => handleChange(item.id, 'name', e.target.value)}
            className="flex-1 min-w-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="number"
            placeholder="Mennyiség"
            value={item.quantity || ''}
            onChange={(e) => handleChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="text"
            placeholder="Egység"
            value={item.unit}
            onChange={(e) => handleChange(item.id, 'unit', e.target.value)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <label className="flex items-center gap-1 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={item.isOptional ?? false}
              onChange={(e) => handleChange(item.id, 'isOptional', e.target.checked)}
              className="rounded accent-primary"
            />
            Opcionális
          </label>
          <button
            type="button"
            onClick={() => handleRemove(item.id)}
            disabled={ingredients.length <= 1}
            className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
            title="Eltávolítás"
            aria-label="Hozzávaló eltávolítása"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
      >
        + Hozzávaló hozzáadása
      </button>
    </div>
  );
}
