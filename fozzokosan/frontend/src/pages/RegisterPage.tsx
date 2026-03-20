import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import ErrorMessage from '../components/common/ErrorMessage';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({ name, email, password, bio: bio.trim() || undefined });
      navigate('/');
    } catch {
      setError('A regisztráció sikertelen. Kérjük, próbáld újra.');
    } finally {
      setIsLoading(false);
    }
  };

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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Bemutatkozás (opcionális)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Pár szó magadról..."
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
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
