import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Instagram, Sparkles, ChevronDown } from 'lucide-react';
import { recipeImportApi } from '../../services/api';
import type { RecipeImportDraft } from '../../types';
import ErrorMessage from '../common/ErrorMessage';

interface RecipeImportPanelProps {
  onImported: (draft: RecipeImportDraft) => void;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const resp = (error as { response?: { data?: { message?: string | string[] } } }).response;
    const msg = resp?.data?.message;
    if (Array.isArray(msg)) return msg.join(' ');
    if (typeof msg === 'string') return msg;
  }
  return 'Az importálás nem sikerült. Próbáld újra, vagy illeszd be a szöveget kézzel.';
}

export default function RecipeImportPanel({ onImported }: RecipeImportPanelProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const importMutation = useMutation({
    mutationFn: (payload: { url?: string; text?: string }) => recipeImportApi.import(payload),
    onSuccess: (result) => {
      setNotice(
        result.source === 'url'
          ? 'A leírást sikerült behúzni a linkből, és feldolgoztuk. Ellenőrizd az adatokat lentebb.'
          : 'A beillesztett szöveget feldolgoztuk. Ellenőrizd az adatokat lentebb.',
      );
      onImported(result.draft);
    },
  });

  const handleImport = () => {
    setNotice(null);
    const trimmedUrl = url.trim();
    const trimmedText = text.trim();
    if (!trimmedUrl && !trimmedText) return;
    importMutation.mutate({
      url: trimmedUrl || undefined,
      text: trimmedText || undefined,
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-text">
          <Sparkles className="h-5 w-5 text-primary" />
          Recept importálása linkből vagy szövegből
        </span>
        <ChevronDown
          className={`h-5 w-5 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          <p className="text-sm text-text-secondary">
            Illessz be egy Instagram-poszt linket, vagy másold be a recept leírását — a rendszer
            megpróbálja automatikusan kitölteni az űrlapot. A mentés előtt mindent ellenőrizhetsz.
          </p>

          <div>
            <label htmlFor="import-url" className="block text-sm font-medium text-text mb-1">
              <span className="inline-flex items-center gap-1.5">
                <Instagram className="h-4 w-4" />
                Instagram link
              </span>
            </label>
            <input
              id="import-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              className="input w-full"
            />
          </div>

          <div className="relative text-center">
            <span className="text-xs text-text-secondary bg-transparent px-2">
              vagy illeszd be a szöveget
            </span>
          </div>

          <div>
            <label htmlFor="import-text" className="block text-sm font-medium text-text mb-1">
              Recept szövege
            </label>
            <textarea
              id="import-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Illeszd be ide a recept leírását (pl. az Instagram-poszt szövegét)..."
              rows={5}
              className="input w-full resize-y"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Tipp: ha a linkből nem sikerül a behúzás (privát vagy bejelentkezést kérő poszt),
              másold be ide a szöveget.
            </p>
          </div>

          {importMutation.isError && (
            <ErrorMessage message={getErrorMessage(importMutation.error)} />
          )}
          {notice && !importMutation.isError && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{notice}</p>
          )}

          <button
            type="button"
            onClick={handleImport}
            disabled={importMutation.isPending || (!url.trim() && !text.trim())}
            className="btn-primary w-full sm:w-auto disabled:opacity-50"
          >
            {importMutation.isPending ? 'Feldolgozás...' : 'Importálás és kitöltés'}
          </button>
        </div>
      )}
    </div>
  );
}
