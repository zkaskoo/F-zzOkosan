import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Calendar, Users } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RecipeCard from '../components/recipe/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { isValidImageUrl } from '../utils/imageUrl';
import type { User } from '../types';

interface UserProfile extends User {
  _count: {
    recipes: number;
    followers: number;
    following: number;
  };
}

function useUserProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);

  const userId = id || currentUser?.id;
  const { data: profile, isLoading, isError } = useUserProfile(userId);
  const { data: recipesData, isLoading: recipesLoading } = useRecipes({
    userId,
    limit: 50,
  });

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" />
      </Layout>
    );
  }

  if (isError || !profile) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <ErrorMessage message="A felhasználó nem található." />
        </div>
      </Layout>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile header */}
          <div className="card p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold">
                {isValidImageUrl(profile.avatar) ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-text mb-1">{profile.name}</h1>
                {profile.bio && (
                  <p className="text-text-secondary mb-4">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {profile._count.recipes} recept
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {profile._count.followers} követő
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {profile._count.following} követés
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Csatlakozott: {joinDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User's recipes */}
          <h2 className="text-xl font-bold text-text mb-6">
            {currentUser?.id === profile.id ? 'Receptjeim' : `${profile.name} receptjei`}
          </h2>

          {recipesLoading ? (
            <LoadingSpinner />
          ) : recipesData && recipesData.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipesData.data.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-12">
              Még nincsenek receptek.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
