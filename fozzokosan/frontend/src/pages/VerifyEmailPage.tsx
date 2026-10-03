import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '../services/api';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import { getApiErrorMessage } from '../utils/apiError';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // StrictMode dupla-futás ellen
    ran.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Hiányzó megerősítő token.');
      return;
    }
    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getApiErrorMessage(err, 'A megerősítés sikertelen.'));
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground />
      <div className="glass w-full max-w-md rounded-2xl p-8 animate-fade-in text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-text-secondary">Email megerősítése folyamatban...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h1 className="text-2xl font-bold text-text mb-3">Sikeres megerősítés</h1>
            <p className="text-text-secondary text-sm mb-6">{message}</p>
            <Link to="/bejelentkezes" className="btn-primary w-full inline-block">
              Bejelentkezés
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h1 className="text-2xl font-bold text-text mb-3">Sikertelen megerősítés</h1>
            <p className="text-text-secondary text-sm mb-6">{message}</p>
            <Link to="/bejelentkezes" className="btn-secondary w-full inline-block">
              Vissza a bejelentkezéshez
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
