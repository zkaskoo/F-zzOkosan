import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, Plus, ShoppingCart, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <ChefHat className="h-7 w-7" />
            FozzOkosan
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              to="/receptek"
              className="text-text-secondary hover:text-primary font-medium transition-colors"
            >
              Receptek
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/bevasarlolista"
                  className="text-text-secondary hover:text-primary font-medium transition-colors flex items-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Bevásárlólista
                </Link>
                <Link
                  to="/etlapterv"
                  className="text-text-secondary hover:text-primary font-medium transition-colors flex items-center gap-1"
                >
                  <CalendarDays className="h-4 w-4" />
                  Étlapterv
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/receptek/uj"
                  className="btn-primary flex items-center gap-1.5 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Új recept</span>
                </Link>
                <Link
                  to="/profil"
                  className="text-sm text-text-secondary hover:text-primary transition-colors hidden sm:inline"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-red-500 transition-colors p-2"
                  title="Kijelentkezés"
                  aria-label="Kijelentkezés"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/bejelentkezes" className="btn-secondary text-sm">
                  Bejelentkezés
                </Link>
                <Link to="/regisztracio" className="btn-primary text-sm">
                  Regisztráció
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
