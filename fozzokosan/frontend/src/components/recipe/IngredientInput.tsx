import { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Wand2 } from 'lucide-react';
import type { IngredientFormItemWithId } from './formTypes';
import { ingredientApi, nlpApi, type IngredientSuggestion } from '../../services/api';

const HUNGARIAN_UNITS = [
  { value: 'g', label: 'g (gramm)' },
  { value: 'dkg', label: 'dkg (dekagramm)' },
  { value: 'kg', label: 'kg (kilogramm)' },
  { value: 'ml', label: 'ml (milliliter)' },
  { value: 'dl', label: 'dl (deciliter)' },
  { value: 'l', label: 'l (liter)' },
  { value: 'ek', label: 'ek (evőkanál)' },
  { value: 'tk', label: 'tk (teáskanál)' },
  { value: 'csésze', label: 'csésze' },
  { value: 'csipet', label: 'csipet' },
  { value: 'db', label: 'db (darab)' },
  { value: 'szelet', label: 'szelet' },
  { value: 'gerezd', label: 'gerezd' },
  { value: 'szál', label: 'szál' },
  { value: 'fej', label: 'fej' },
  { value: 'csokor', label: 'csokor' },
  { value: 'csomag', label: 'csomag' },
];

interface IngredientInputProps {
  ingredients: IngredientFormItemWithId[];
  onChange: (ingredients: IngredientFormItemWithId[]) => void;
}

function IngredientRow({
  item,
  canRemove,
  onFieldChange,
  onRemove,
}: {
  item: IngredientFormItemWithId;
  canRemove: boolean;
  onFieldChange: (id: string, field: keyof IngredientFormItemWithId, value: string | number | boolean) => void;
  onRemove: (id: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback((query: string) => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await ingredientApi.search(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 250);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion: IngredientSuggestion) => {
    onFieldChange(item.id, 'ingredientName', suggestion.name);
    if (suggestion.defaultUnit) {
      onFieldChange(item.id, 'unit', suggestion.defaultUnit);
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[140px]" ref={wrapperRef}>
        <input
          type="text"
          placeholder="Hozzávaló neve"
          value={item.ingredientName}
          onChange={(e) => {
            onFieldChange(item.id, 'ingredientName', e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
                >
                  <span className="font-medium">{s.name}</span>
                  {s.defaultUnit && (
                    <span className="text-text-secondary ml-2">({s.defaultUnit})</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="number"
        placeholder="Mennyiség"
        value={item.quantity || ''}
        onChange={(e) => onFieldChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
      <select
        value={item.unit}
        onChange={(e) => onFieldChange(item.id, 'unit', e.target.value)}
        className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
      >
        <option value="">Egység...</option>
        {HUNGARIAN_UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={item.isOptional ?? false}
          onChange={(e) => onFieldChange(item.id, 'isOptional', e.target.checked)}
          className="rounded accent-primary"
        />
        Opcionális
      </label>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={!canRemove}
        className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
        title="Eltávolítás"
        aria-label="Hozzávaló eltávolítása"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [freeText, setFreeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showFreeText, setShowFreeText] = useState(false);

  const handleChange = (id: string, field: keyof IngredientFormItemWithId, value: string | number | boolean) => {
    const updated = ingredients.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...ingredients, { id: crypto.randomUUID(), ingredientName: '', quantity: 0, unit: '', isOptional: false }]);
  };

  const handleRemove = (id: string) => {
    if (ingredients.length <= 1) return;
    onChange(ingredients.filter((item) => item.id !== id));
  };

  const handleParseFreeText = async () => {
    if (!freeText.trim()) return;
    setIsParsing(true);
    try {
      const parsed = await nlpApi.parseIngredients(freeText);
      if (parsed.length > 0) {
        const newItems: IngredientFormItemWithId[] = parsed.map((p) => ({
          id: crypto.randomUUID(),
          ingredientName: p.name,
          quantity: p.quantity,
          unit: p.unit,
          notes: p.notes,
          isOptional: false,
        }));
        // Replace empty first row or append
        const hasOnlyEmptyRow = ingredients.length === 1 && !ingredients[0].ingredientName;
        onChange(hasOnlyEmptyRow ? newItems : [...ingredients, ...newItems]);
        setFreeText('');
        setShowFreeText(false);
      }
    } catch {
      // silently fail - user can manually enter
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text">Hozzávalók</label>
        <button
          type="button"
          onClick={() => setShowFreeText(!showFreeText)}
          className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
        >
          <Wand2 className="h-3.5 w-3.5" />
          {showFreeText ? 'Kézi bevitel' : 'Szabad szöveges bevitel'}
        </button>
      </div>

      {showFreeText && (
        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 space-y-2">
          <p className="text-xs text-text-secondary">
            Írd be a hozzávalókat szabadon magyarul, és az AI felismeri őket.
          </p>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="pl. 2 evőkanál olívaolaj, fél kiló csirkemell, 3 gerezd fokhagyma finomra vágva"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          />
          <button
            type="button"
            onClick={handleParseFreeText}
            disabled={isParsing || !freeText.trim()}
            className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Wand2 className="h-3.5 w-3.5" />
            {isParsing ? 'Feldolgozás...' : 'Felismerés'}
          </button>
        </div>
      )}

      {ingredients.map((item) => (
        <IngredientRow
          key={item.id}
          item={item}
          canRemove={ingredients.length > 1}
          onFieldChange={handleChange}
          onRemove={handleRemove}
        />
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
