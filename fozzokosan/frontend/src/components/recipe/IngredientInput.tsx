import { Trash2 } from 'lucide-react';
import type { IngredientFormItem } from '../../types';

interface IngredientInputProps {
  ingredients: IngredientFormItem[];
  onChange: (ingredients: IngredientFormItem[]) => void;
}

export default function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const handleChange = (index: number, field: keyof IngredientFormItem, value: string | number | boolean) => {
    const updated = ingredients.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...ingredients, { name: '', quantity: 0, unit: '', isOptional: false }]);
  };

  const handleRemove = (index: number) => {
    if (ingredients.length <= 1) return;
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Hozzávalók</label>
      {ingredients.map((item, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Hozzávaló neve"
            value={item.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            className="flex-1 min-w-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="number"
            placeholder="Mennyiség"
            value={item.quantity || ''}
            onChange={(e) => handleChange(index, 'quantity', parseFloat(e.target.value) || 0)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="text"
            placeholder="Egység"
            value={item.unit}
            onChange={(e) => handleChange(index, 'unit', e.target.value)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <label className="flex items-center gap-1 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={item.isOptional ?? false}
              onChange={(e) => handleChange(index, 'isOptional', e.target.checked)}
              className="rounded accent-primary"
            />
            Opcionális
          </label>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            disabled={ingredients.length <= 1}
            className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
            title="Eltávolítás"
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
