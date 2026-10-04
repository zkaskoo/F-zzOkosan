import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, Plus, ShoppingCart, CalendarDays, Bookmark } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="page-container">
        <div className="header-bar">
          <Link to="/" className="header-logo">
            <ChefHat className="h-7 w-7" />
            FozzOkosan
          </Link>

          <nav className="header-nav">
            <Link to="/receptek" className="nav-link">
              Receptek
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/kedvencek" className="nav-link">
                  <Bookmark className="h-4 w-4" />
                  Kedvencek
                </Link>
                <Link to="/bevasarlolista" className="nav-link">
                  <ShoppingCart className="h-4 w-4" />
                  Bevásárlólista
                </Link>
                <Link to="/etlapterv" className="nav-link">
                  <CalendarDays className="h-4 w-4" />
                  Étlapterv
                </Link>
              </>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/receptek/uj" className="btn-primary btn-sm">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Új recept</span>
                </Link>
                <Link to="/profil" className="link-subtle hidden sm:inline">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="icon-btn-danger"
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
