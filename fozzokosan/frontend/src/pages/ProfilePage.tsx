import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Calendar, Users, Edit, Camera, X, Check, UserPlus, UserMinus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RecipeCard from '../components/recipe/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import { api, followApi } from '../services/api';
import { uploadApi } from '../services/uploadApi';
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
  const queryClient = useQueryClient();

  const userId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;
  const { data: profile, isLoading, isError } = useUserProfile(userId);
  const { data: recipesData, isLoading: recipesLoading } = useRecipes({
    userId,
    limit: 50,
  });

  const { data: followStatus } = useQuery({
    queryKey: ['follow-status', userId],
    queryFn: () => followApi.getStatus(userId!),
    enabled: !!userId && !isOwnProfile && !!currentUser,
  });

  const followMutation = useMutation({
    mutationFn: () => followApi.toggle(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [uploading, setUploading] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: { name?: string; bio?: string; avatar?: string }) => {
      const { data: updated } = await api.patch<User>('/users/me', data);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      useAuthStore.setState((s) => ({ ...s, user: { ...s.user!, ...updated } }));
      setEditing(false);
    },
  });

  const startEditing = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditBio(profile.bio || '');
    setEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ name: editName.trim(), bio: editBio.trim() || undefined });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      updateMutation.mutate({ avatar: result.url });
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <Layout><LoadingSpinner size="lg" /></Layout>;
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
              {/* Avatar */}
              <div className="relative">
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
                {isOwnProfile && (
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary-dark transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Név"
                    />
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                      placeholder="Bio"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={!editName.trim() || updateMutation.isPending}
                        className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Mentés
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn-secondary text-sm flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Mégse
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-text">{profile.name}</h1>
                      {isOwnProfile && (
                        <button
                          type="button"
                          onClick={startEditing}
                          className="text-text-secondary hover:text-primary transition-colors"
                          title="Profil szerkesztése"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {profile.bio && (
                      <p className="text-text-secondary mb-4">{profile.bio}</p>
                    )}
                    {!isOwnProfile && currentUser && (
                      <button
                        type="button"
                        onClick={() => followMutation.mutate()}
                        disabled={followMutation.isPending}
                        className={`mt-2 flex items-center gap-1.5 rounded-lg py-2 px-4 text-sm font-semibold transition-colors ${
                          followStatus?.following
                            ? 'bg-gray-200 text-text hover:bg-gray-300'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        {followStatus?.following ? (
                          <><UserMinus className="h-4 w-4" /> Követés leállítása</>
                        ) : (
                          <><UserPlus className="h-4 w-4" /> Követés</>
                        )}
                      </button>
                    )}
                  </>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-text-secondary mt-4">
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
            {isOwnProfile ? 'Receptjeim' : `${profile.name} receptjei`}
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
