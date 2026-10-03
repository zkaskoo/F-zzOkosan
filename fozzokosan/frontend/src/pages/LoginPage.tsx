import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import ErrorMessage from '../components/common/ErrorMessage';
import { getApiErrorMessage, isEmailNotVerifiedError } from '../utils/apiError';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendInfo, setResendInfo] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendInfo(null);
    setNeedsVerification(false);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Hibás email cím vagy jelszó.'));
      if (isEmailNotVerifiedError(err)) setNeedsVerification(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendInfo(null);
    try {
      await authApi.resendVerification(email);
      setResendInfo('Elküldtük a megerősítő emailt. Nézd meg a postaládád (és a spam mappát).');
    } catch {
      setResendInfo('Nem sikerült elküldeni. Próbáld újra később.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground />
      <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-text text-center mb-6">Bejelentkezés</h1>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {needsVerification && (
          <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
            <p className="text-text-secondary mb-2">
              Még nincs megerősítve az email-címed.
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Megerősítő email újraküldése
            </button>
            {resendInfo && <p className="mt-2 text-green-700">{resendInfo}</p>}
          </div>
        )}

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
          <div>
            <label className="block text-sm font-medium text-text mb-1">Jelszó</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="input w-full"
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/elfelejtett-jelszo" className="text-primary hover:text-primary-dark font-medium">
            Elfelejtetted a jelszavad?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-text-secondary">
          Még nincs fiókod?{' '}
          <Link to="/regisztracio" className="text-primary hover:text-primary-dark font-medium">
            Regisztráció
          </Link>
        </p>
      </div>
    </div>
  );
}
