import { Link } from 'react-router-dom';
import { ChefHat, Utensils, Heart } from 'lucide-react';
import Layout from '../components/layout/Layout';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useRecipes } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';

export default function HomePage() {
  const { data, isLoading } = useRecipes({ limit: 6 });
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-yellow-50 to-secondary/10 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-tight">
              Főzz <span className="text-primary">okosan</span>,{' '}
              <span className="text-secondary">egyél</span> finomakat!
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Fedezd fel a közösség legjobb receptjeit, oszd meg saját ötleteidet, és inspirálódj minden nap.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/receptek" className="btn-primary text-base px-6 py-3">
                Receptek böngészése
              </Link>
              {isAuthenticated ? (
                <Link to="/receptek/uj" className="btn-secondary text-base px-6 py-3">
                  Új recept létrehozása
                </Link>
              ) : (
                <Link to="/regisztracio" className="btn-secondary text-base px-6 py-3">
                  Csatlakozz hozzánk
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ChefHat className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-text">Közösségi receptek</h3>
                <p className="text-sm text-text-secondary">
                  Böngéssz a felhasználók által megosztott receptek között.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                  <Utensils className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-text">Egyszerű elkészítés</h3>
                <p className="text-sm text-text-secondary">
                  Lépésről lépésre követhető útmutatók kezdőknek és haladóknak.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <Heart className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="font-semibold text-text">Kedvencek mentése</h3>
                <p className="text-sm text-text-secondary">
                  Jelöld meg kedvenc receptjeidet, hogy bármikor visszataláljál hozzájuk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest recipes */}
        <section className="py-16 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text">Legújabb receptek</h2>
              <Link to="/receptek" className="text-primary hover:text-primary-dark font-medium text-sm">
                Összes recept &rarr;
              </Link>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : data && data.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-center text-text-secondary py-12">
                Még nincsenek receptek. Legyél te az első, aki megoszt egyet!
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
