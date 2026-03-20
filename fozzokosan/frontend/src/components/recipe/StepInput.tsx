import { Trash2 } from 'lucide-react';
import type { StepFormItemWithId } from './formTypes';

interface StepInputProps {
  steps: StepFormItemWithId[];
  onChange: (steps: StepFormItemWithId[]) => void;
}

export default function StepInput({ steps, onChange }: StepInputProps) {
  const handleChange = (id: string, instruction: string) => {
    const updated = steps.map((item) =>
      item.id === id ? { ...item, instruction } : item,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...steps, { id: crypto.randomUUID(), stepNumber: steps.length + 1, instruction: '' }]);
  };

  const handleRemove = (id: string) => {
    if (steps.length <= 1) return;
    const filtered = steps.filter((item) => item.id !== id);
    const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    onChange(renumbered);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Elkészítés lépései</label>
      {steps.map((item, index) => (
        <div key={item.id} className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary mt-1">
            {index + 1}
          </span>
          <textarea
            placeholder={`${index + 1}. lépés leírása`}
            value={item.instruction}
            onChange={(e) => handleChange(item.id, e.target.value)}
            rows={2}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
          />
          <button
            type="button"
            onClick={() => handleRemove(item.id)}
            disabled={steps.length <= 1}
            className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors mt-1"
            title="Eltávolítás"
            aria-label="Lépés eltávolítása"
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
        + Lépés hozzáadása
      </button>
    </div>
  );
}
