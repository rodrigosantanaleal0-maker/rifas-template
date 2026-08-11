import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Lock, LogIn, Mail, Ticket } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_CREDENTIALS } from '../../services/authService';

export function AdminLogin() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(DEMO_CREDENTIALS?.email ?? '');
  const [password, setPassword] = useState(DEMO_CREDENTIALS?.password ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg bg-grid px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-2xl">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#181103]">
            <Ticket size={20} strokeWidth={2.5} />
          </span>
          Pack<span className="text-gradient-gold">LP</span> Admin
        </div>
        <p className="mt-2 text-sm text-ink-muted">Acesse o painel para gerenciar sua campanha.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-muted">
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-ink-muted">
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {error && <p className="text-sm text-ruby-400">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
            icon={submitting ? <Loader2 size={17} className="animate-spin" /> : <LogIn size={17} />}
            iconPosition="left"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        {DEMO_CREDENTIALS && (
          <p className="mt-6 rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-xs leading-relaxed text-ink-faint">
            <strong className="text-ink-muted">Ambiente de demonstração.</strong> Credenciais já preenchidas:{' '}
            <code className="text-ink-muted">{DEMO_CREDENTIALS.email}</code> /{' '}
            <code className="text-ink-muted">{DEMO_CREDENTIALS.password}</code>. Configure{' '}
            <code className="text-ink-muted">VITE_API_BASE_URL</code> para conectar o backend real.
          </p>
        )}
      </div>
    </div>
  );
}
