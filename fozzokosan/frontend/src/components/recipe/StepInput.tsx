import { Trash2 } from 'lucide-react';
import type { StepFormItem } from '../../types';

interface StepInputProps {
  steps: StepFormItem[];
  onChange: (steps: StepFormItem[]) => void;
}

export default function StepInput({ steps, onChange }: StepInputProps) {
  const handleChange = (index: number, instruction: string) => {
    const updated = steps.map((item, i) =>
      i === index ? { ...item, instruction } : item,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...steps, { stepNumber: steps.length + 1, instruction: '' }]);
  };

  const handleRemove = (index: number) => {
    if (steps.length <= 1) return;
    const filtered = steps.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    onChange(renumbered);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Elkészítés lépései</label>
      {steps.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary mt-1">
            {index + 1}
          </span>
          <textarea
            placeholder={`${index + 1}. lépés leírása`}
            value={item.instruction}
            onChange={(e) => handleChange(index, e.target.value)}
            rows={2}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            disabled={steps.length <= 1}
            className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors mt-1"
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
        + Lépés hozzáadása
      </button>
    </div>
  );
}
