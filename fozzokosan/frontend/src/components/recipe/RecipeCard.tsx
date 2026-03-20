import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const difficultyConfig = {
  EASY: { label: 'Könnyű', bg: 'bg-green-100', text: 'text-green-700' },
  MEDIUM: { label: 'Közepes', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  HARD: { label: 'Nehéz', bg: 'bg-red-100', text: 'text-red-700' },
} as const;

function formatCookingTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} óra ${mins} perc` : `${hours} óra`;
  }
  return `${minutes} perc`;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const difficulty = difficultyConfig[recipe.difficulty];

  return (
    <Link to={`/receptek/${recipe.id}`} className="card group block">
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-primary/60 to-yellow-400/60" />
      )}

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          {recipe.cookingTime != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatCookingTime(recipe.cookingTime)}
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings} adag
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-text-secondary">
            {recipe.user.name}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficulty.bg} ${difficulty.text}`}
          >
            {difficulty.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
