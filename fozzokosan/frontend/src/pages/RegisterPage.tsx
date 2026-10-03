import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import ErrorMessage from '../components/common/ErrorMessage';
import { getApiErrorMessage } from '../utils/apiError';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({ name, email, password, bio: bio.trim() || undefined });
      setSubmitted(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'A regisztráció sikertelen. Kérjük, próbáld újra.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <AnimatedBackground />
        <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">Erősítsd meg az emailed</h1>
          <p className="text-text-secondary text-sm mb-6">
            Küldtünk egy megerősítő emailt a(z) <span className="font-medium text-text">{email}</span> címre.
            Kattints a benne lévő linkre, hogy aktiváld a fiókod és beléphess.
          </p>
          <p className="text-xs text-text-secondary mb-6">
            Nem jött meg? Nézd meg a spam mappát is, vagy kérj új emailt a bejelentkezési oldalon.
          </p>
          <Link to="/bejelentkezes" className="btn-primary w-full inline-block">
            Tovább a bejelentkezéshez
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground />
      <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-text text-center mb-6">Regisztráció</h1>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Név</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Kovács János"
              className="input w-full"
            />
          </div>
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
              placeholder="Legalább 6 karakter"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Bemutatkozás (opcionális)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Pár szó magadról..."
              rows={2}
              className="input w-full resize-y"
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Regisztráció...' : 'Regisztráció'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Már van fiókod?{' '}
          <Link to="/bejelentkezes" className="text-primary hover:text-primary-dark font-medium">
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  );
}
