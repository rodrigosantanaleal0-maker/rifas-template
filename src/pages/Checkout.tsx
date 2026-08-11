import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, CreditCard, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { TrustBadges } from '../components/ui/TrustBadges';
import { useCampaignData } from '../hooks/useCampaignData';
import { createOrder } from '../lib/api';
import { formatCurrencyBRL } from '../lib/format';
import type { OrderResponse, PaymentMethod } from '../types';
import { cn } from '../lib/cn';

interface CheckoutState {
  numbers: number[];
  campaignId: string;
}

export function Checkout() {
  const location = useLocation();
  const { campaign } = useCampaignData();

  const state = location.state as CheckoutState | null;
  const numbers = state?.numbers ?? [];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const totalCents = campaign ? numbers.length * campaign.numberPriceCents : 0;
  const canSubmit = name.trim() && email.trim() && document.trim() && acceptedTerms && numbers.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !campaign) return;
    setSubmitting(true);
    try {
      const res = await createOrder({
        campaignId: campaign.id,
        quantity: numbers.length,
        numbers,
        totalCents,
        paymentMethod,
        buyerName: name,
        buyerEmail: email,
        buyerDocument: document,
        acceptedTerms,
      });
      setOrder(res);
    } finally {
      setSubmitting(false);
    }
  }

  if (numbers.length === 0 && !order) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center px-5 py-24 text-center">
          <div>
            <p className="font-display text-xl font-bold text-ink">Nenhuma seleção encontrada</p>
            <p className="mt-2 text-sm text-ink-muted">
              Volte à página inicial e escolha seus números para continuar.
            </p>
            <Link to="/#pacotes" className="mt-6 inline-block">
              <Button>Ver promoções</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (order) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <Container className="max-w-lg text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={32} />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold text-ink">Pedido registrado (demonstração)</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Pedido <strong className="text-ink">#{order.id}</strong> criado com status{' '}
              <strong className="text-ink">{order.status === 'pending_payment' ? 'aguardando pagamento' : order.status}</strong>.
              Este é um ambiente de demonstração — nenhum pagamento real foi processado. Em produção, esta
              etapa se integra a um gateway de pagamento autorizado pelo backend.
            </p>
            <Link to="/" className="mt-8 inline-block">
              <Button variant="outline">Voltar ao início</Button>
            </Link>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="py-16 sm:py-20">
        <Container className="max-w-5xl">
          <h1 className="font-display text-3xl font-extrabold text-ink">Finalizar participação</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Interface de checkout de demonstração. Nenhum processamento financeiro real ocorre neste
            template.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Seus dados</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Nome completo" htmlFor="name">
                    <input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="E-mail" htmlFor="email">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="CPF" htmlFor="document" className="sm:col-span-2">
                    <input
                      id="document"
                      required
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      className="input-field"
                      placeholder="000.000.000-00"
                      autoComplete="off"
                    />
                  </Field>
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-ink">Forma de pagamento</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    icon={<QrCode size={18} />}
                    label="Pix"
                    description="Aprovação imediata"
                    selected={paymentMethod === 'pix'}
                    onClick={() => setPaymentMethod('pix')}
                  />
                  <PaymentOption
                    icon={<CreditCard size={18} />}
                    label="Cartão de crédito"
                    description="Via gateway autorizado"
                    selected={paymentMethod === 'credit_card'}
                    onClick={() => setPaymentMethod('credit_card')}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-gold-500"
                  required
                />
                Li e aceito o{' '}
                <Link to="/regulamento" className="text-gold-400 hover:underline">
                  regulamento completo
                </Link>{' '}
                e os termos de uso desta campanha.
              </label>

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || submitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-40"
                icon={submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                iconPosition="left"
              >
                {submitting ? 'Processando…' : 'Confirmar participação'}
              </Button>
            </form>

            <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-lg font-bold text-ink">Resumo</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Quantidade</span>
                  <span className="font-medium text-ink">{numbers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Valor por número</span>
                  <span className="font-medium text-ink">
                    {campaign ? formatCurrencyBRL(campaign.numberPriceCents) : '—'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto border-t border-border-soft pt-4">
                {numbers.map((n) => (
                  <span key={n} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-ink-muted">
                    {String(n).padStart(5, '0')}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-xl font-extrabold text-gold-400">
                  {formatCurrencyBRL(totalCents)}
                </span>
              </div>
              <TrustBadges className="mt-5 border-t border-border-soft pt-4" />
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function PaymentOption({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
        selected ? 'border-gold-500 bg-gold-500/10' : 'border-border bg-surface-2 hover:border-border/80',
      )}
    >
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', selected ? 'bg-gold-500/20 text-gold-300' : 'bg-surface-3 text-ink-faint')}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-ink-faint">{description}</span>
      </span>
    </button>
  );
}
