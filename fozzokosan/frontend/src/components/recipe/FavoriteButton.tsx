import { Bookmark } from 'lucide-react';
import { useFavoriteStatus, useToggleFavorite } from '../../hooks/useFavorites';
import { useAuthStore } from '../../stores/authStore';

interface FavoriteButtonProps {
  recipeId: string;
  compact?: boolean;
}

export default function FavoriteButton({ recipeId, compact = false }: FavoriteButtonProps) {
  const { data: status } = useFavoriteStatus(recipeId);
  const toggleFavorite = useToggleFavorite(recipeId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const favorited = status?.favorited ?? false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    toggleFavorite.mutate();
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={!isAuthenticated || toggleFavorite.isPending}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
        title={!isAuthenticated ? 'Jelentkezz be a mentéshez' : favorited ? 'Eltávolítás a kedvencekből' : 'Mentés a kedvencekbe'}
        aria-label={favorited ? 'Eltávolítás a kedvencekből' : 'Mentés a kedvencekbe'}
      >
        <Bookmark
          className={`h-3.5 w-3.5 transition-colors ${favorited ? 'fill-primary text-primary' : ''}`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isAuthenticated || toggleFavorite.isPending}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
        favorited
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
      }`}
      title={!isAuthenticated ? 'Jelentkezz be a mentéshez' : undefined}
    >
      <Bookmark
        className={`h-5 w-5 transition-all ${favorited ? 'fill-primary text-primary scale-110' : ''}`}
      />
      {favorited ? 'Mentve' : 'Mentés'}
    </button>
  );
}
