import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { authApi } from '../services/api';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import ErrorMessage from '../components/common/ErrorMessage';
import { getApiErrorMessage } from '../utils/apiError';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Hiba történt. Próbáld újra.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground />
      <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-3">Ellenőrizd a postaládád</h1>
            <p className="text-text-secondary text-sm mb-6">
              Ha létezik fiók a megadott email-címmel, elküldtük rá a jelszó-visszaállító linket.
              A link 1 óráig érvényes.
            </p>
            <Link to="/bejelentkezes" className="btn-primary w-full inline-block">
              Vissza a bejelentkezéshez
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-text text-center mb-2">Elfelejtett jelszó</h1>
            <p className="text-text-secondary text-sm text-center mb-6">
              Add meg az email-címed, és küldünk egy linket az új jelszó beállításához.
            </p>

            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="pelda@email.com"
                  className="input w-full"
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Küldés...' : 'Visszaállító link kérése'}
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
