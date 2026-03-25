import { Heart } from 'lucide-react';
import { useLikeStatus, useToggleLike } from '../../hooks/useLikes';
import { useAuthStore } from '../../stores/authStore';

interface LikeButtonProps {
  recipeId: string;
  compact?: boolean;
}

export default function LikeButton({ recipeId, compact = false }: LikeButtonProps) {
  const { data: likeStatus } = useLikeStatus(recipeId);
  const toggleLike = useToggleLike(recipeId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const liked = likeStatus?.liked ?? false;
  const count = likeStatus?.count ?? 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    toggleLike.mutate();
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={!isAuthenticated || toggleLike.isPending}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
        title={!isAuthenticated ? 'Jelentkezz be a kedveléshez' : undefined}
      >
        <Heart
          className={`h-3.5 w-3.5 transition-colors ${liked ? 'fill-red-500 text-red-500' : ''}`}
        />
        {count > 0 && count}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isAuthenticated || toggleLike.isPending}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
      }`}
      title={!isAuthenticated ? 'Jelentkezz be a kedveléshez' : undefined}
    >
      <Heart
        className={`h-5 w-5 transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
      />
      {count > 0 ? count : 'Kedvelés'}
    </button>
  );
}
