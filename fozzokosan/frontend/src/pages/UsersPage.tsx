import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { userApi, type UserListItem } from '../services/api';
import { isValidImageUrl } from '../utils/imageUrl';

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userApi.list(search || undefined),
  });

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold text-text">Felhasználók</h1>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Felhasználó keresése..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {isLoading && <LoadingSpinner size="lg" />}

          {users && users.length === 0 && (
            <p className="text-center text-text-secondary py-12">Nincs találat.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users?.map((user: UserListItem) => (
              <Link
                key={user.id}
                to={`/profil/${user.id}`}
                className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {isValidImageUrl(user.avatar) ? (
                    <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text truncate">{user.name}</p>
                  {user.bio && (
                    <p className="text-xs text-text-secondary truncate">{user.bio}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {user._count.recipes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {user._count.followers}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
