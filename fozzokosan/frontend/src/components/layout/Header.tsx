import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, Plus, ShoppingCart, CalendarDays, Bookmark, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="page-container">
        <div className="header-bar">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <ChefHat className="h-7 w-7" />
            OkosanFőzz
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
                  className="icon-btn-danger hidden sm:inline-flex"
                  title="Kijelentkezés"
                  aria-label="Kijelentkezés"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/bejelentkezes"
                  className="btn-secondary text-sm whitespace-nowrap !px-3 !py-1.5 sm:!px-4 sm:!py-2"
                >
                  <span className="sm:hidden">Belépés</span>
                  <span className="hidden sm:inline">Bejelentkezés</span>
                </Link>
                <Link
                  to="/regisztracio"
                  className="btn-primary text-sm whitespace-nowrap !px-3 !py-1.5 sm:!px-4 sm:!py-2"
                >
                  Regisztráció
                </Link>
              </>
            )}

            {/* Hamburger – csak mobilon */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="hamburger-btn sm:hidden"
              aria-label="Menü"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Lenyíló mobil menü – a desktopon látható menüpontok */}
        {menuOpen && (
          <nav className="mobile-menu sm:hidden">
            <Link to="/receptek" className="mobile-menu-link" onClick={closeMenu}>
              <ChefHat className="h-5 w-5" />
              Receptek
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/kedvencek" className="mobile-menu-link" onClick={closeMenu}>
                  <Bookmark className="h-5 w-5" />
                  Kedvencek
                </Link>
                <Link to="/bevasarlolista" className="mobile-menu-link" onClick={closeMenu}>
                  <ShoppingCart className="h-5 w-5" />
                  Bevásárlólista
                </Link>
                <Link to="/etlapterv" className="mobile-menu-link" onClick={closeMenu}>
                  <CalendarDays className="h-5 w-5" />
                  Étlapterv
                </Link>

                <hr className="my-1 border-gray-200" />

                <Link to="/profil" className="mobile-menu-link" onClick={closeMenu}>
                  <User className="h-5 w-5" />
                  {user?.name ?? 'Profil'}
                </Link>
                <button onClick={handleLogout} className="mobile-menu-link text-red-600">
                  <LogOut className="h-5 w-5" />
                  Kijelentkezés
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
