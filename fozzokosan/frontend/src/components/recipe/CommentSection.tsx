import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trash2, Send } from 'lucide-react';
import { useComments, useCreateComment, useDeleteComment } from '../../hooks/useComments';
import { useAuthStore } from '../../stores/authStore';
import { isValidImageUrl } from '../../utils/imageUrl';

interface CommentSectionProps {
  recipeId: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'most';
  if (diffMin < 60) return `${diffMin} perce`;
  if (diffHour < 24) return `${diffHour} órája`;
  if (diffDay < 7) return `${diffDay} napja`;
  return date.toLocaleDateString('hu-HU');
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const { data: commentsData, isLoading } = useComments(recipeId, page);
  const createComment = useCreateComment(recipeId);
  const deleteComment = useDeleteComment(recipeId);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(content.trim(), {
      onSuccess: () => {
        setContent('');
        setPage(1);
      },
    });
  };

  const comments = commentsData?.data ?? [];
  const totalPages = commentsData?.totalPages ?? 1;

  return (
    <div className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-text mb-4">
        <MessageCircle className="h-5 w-5" />
        Hozzászólások
        {commentsData?.total ? ` (${commentsData.total})` : ''}
      </h2>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-1">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Írj hozzászólást..."
                rows={2}
                maxLength={2000}
                className="input w-full resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || createComment.isPending}
                  className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Küldés
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-text-secondary mb-6">
          <Link to="/bejelentkezes" className="text-primary hover:underline">
            Jelentkezz be
          </Link>
          {' '}a hozzászóláshoz.
        </p>
      )}

      {/* Comments list */}
      {isLoading ? (
        <p className="text-sm text-text-secondary">Betöltés...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-text-secondary">Még nincsenek hozzászólások.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-text-secondary font-bold text-xs mt-0.5">
                {isValidImageUrl(comment.user.avatar) ? (
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  comment.user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {timeAgo(comment.createdAt)}
                  </span>
                  {user?.id === comment.userId && (
                    <button
                      onClick={() => deleteComment.mutate(comment.id)}
                      disabled={deleteComment.isPending}
                      className="ml-auto text-text-secondary hover:text-red-500 transition-colors"
                      title="Hozzászólás törlése"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-text mt-0.5 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
