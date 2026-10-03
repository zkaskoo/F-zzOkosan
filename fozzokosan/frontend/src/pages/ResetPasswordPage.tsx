import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/api';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import ErrorMessage from '../components/common/ErrorMessage';
import { getApiErrorMessage } from '../utils/apiError';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Hiányzó vagy érvénytelen visszaállító token.');
      return;
    }
    if (password.length < 6) {
      setError('A jelszó legalább 6 karakter legyen.');
      return;
    }
    if (password !== password2) {
      setError('A két jelszó nem egyezik.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'A jelszó visszaállítása sikertelen.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground />
      <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h1 className="text-2xl font-bold text-text mb-3">Kész!</h1>
            <p className="text-text-secondary text-sm mb-6">
              A jelszavad megváltozott. Most már bejelentkezhetsz az új jelszóval.
            </p>
            <Link to="/bejelentkezes" className="btn-primary w-full inline-block">
              Bejelentkezés
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-text text-center mb-6">Új jelszó beállítása</h1>

            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Új jelszó</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Legalább 6 karakter"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Új jelszó megerősítése</label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  placeholder="Írd be újra"
                  className="input w-full"
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Mentés...' : 'Jelszó megváltoztatása'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              <Link to="/bejelentkezes" className="text-primary hover:text-primary-dark font-medium">
                Vissza a bejelentkezéshez
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
