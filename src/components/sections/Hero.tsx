import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Award, Calendar, Flame, Gift, Lock, ShieldCheck, Ticket, Users } from 'lucide-react';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CountdownTimer } from '../ui/CountdownTimer';
import type { AvailabilitySnapshot, Campaign } from '../../types';
import { formatCurrencyBRL, formatDateLong } from '../../lib/format';

interface HeroProps {
  campaign: Campaign | null;
  availability: AvailabilitySnapshot | null;
  loading: boolean;
}

const LOW_STOCK_THRESHOLD = 80;

const STATUS_BADGE = {
  active: { label: 'Campanha ativa', tone: 'gold' as const, pulse: true },
  paused: { label: 'Campanha pausada', tone: 'violet' as const, pulse: false },
  finished: { label: 'Campanha encerrada', tone: 'neutral' as const, pulse: false },
};

export function Hero({ campaign, availability, loading }: HeroProps) {
  const percentSold =
    availability && availability.totalNumbers > 0
      ? Math.round((availability.soldNumbers / availability.totalNumbers) * 100)
      : 0;
  const isLowStock = !loading && percentSold >= LOW_STOCK_THRESHOLD;
  const statusBadge = STATUS_BADGE[campaign?.status ?? 'active'];

  return (
    <section id="topo" className="relative overflow-hidden pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-600/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-gold-500/20 blur-[120px]" />

      <Container className="relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusBadge.tone} pulse={statusBadge.pulse} icon={statusBadge.pulse ? <span aria-hidden>🔥</span> : undefined}>
              {statusBadge.label}
            </Badge>
            {isLowStock && campaign?.status === 'active' && (
              <Badge tone="ruby" icon={<Flame size={12} />}>
                Últimos números disponíveis
              </Badge>
            )}
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Concorra a{' '}
            <span className="text-gradient-gold">
              {loading ? 'um prêmio exclusivo' : campaign?.prizeName}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-ink-muted">
            {campaign?.tagline ?? 'Uma experiência exclusiva para nossa comunidade.'}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
            <StatItem
              icon={<Award size={16} />}
              label="Valor estimado"
              value={campaign ? formatCurrencyBRL(campaign.prizeEstimatedValueCents) : '—'}
              loading={loading}
            />
            <StatItem
              icon={<Ticket size={16} />}
              label="Total de números"
              value={campaign ? campaign.totalNumbers.toLocaleString('pt-BR') : '—'}
              loading={loading}
            />
            <StatItem
              icon={<Calendar size={16} />}
              label="Resultado previsto"
              value={campaign ? formatDateLong(campaign.drawDateISO) : '—'}
              loading={loading}
            />
            <StatItem
              icon={<Users size={16} />}
              label="Participação"
              value={`${percentSold}% vendido`}
              loading={loading}
            />
          </dl>

          {campaign && (
            <div className="mt-8">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Apuração em
              </p>
              <CountdownTimer targetISO={campaign.drawDateISO} />
            </div>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#pacotes">
              <Button size="lg" icon={<ArrowRight size={18} />} className="w-full sm:w-auto">
                Participar agora
              </Button>
            </a>
            <a href="#como-funciona">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Como funciona
              </Button>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" /> Pagamento seguro
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-400" /> Dados protegidos (LGPD)
            </span>
          </div>
        </motion.div>

        <PrizeShowcase percentSold={percentSold} loading={loading} />
      </Container>
    </section>
  );
}

function PrizeShowcase({ percentSold, loading }: { percentSold: number; loading: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative mx-auto w-full max-w-md"
      style={{ perspective: 1000 }}
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[conic-gradient(from_0deg,var(--color-gold-500),var(--color-violet-600),var(--color-gold-500))] opacity-40 blur-3xl animate-glow-pulse" />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-surface-2 to-surface p-1.5 shadow-2xl"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[1.6rem] border border-border-soft bg-surface-2/60 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.18),transparent_55%)]" />
          {loading ? (
            <div className="h-16 w-16 animate-pulse rounded-2xl bg-surface-3" />
          ) : (
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#181103] shadow-[0_0_30px_-4px_rgba(245,179,1,0.6)]">
              <Gift size={30} />
            </span>
          )}
          <div className="relative">
            <p className="font-display text-lg font-semibold text-ink">Imagem do prêmio</p>
            <p className="mx-auto mt-1 max-w-[220px] text-sm text-ink-faint">
              Placeholder — substituir por foto real em alta qualidade do prêmio
            </p>
          </div>
        </div>

        <span className="absolute left-4 top-4 rounded-full border border-gold-500/30 bg-surface/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300 backdrop-blur">
          Edição exclusiva
        </span>
      </motion.div>

      <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-border glass px-5 py-3.5 shadow-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Números vendidos</span>
          <span className="font-display font-bold text-gold-400">{percentSold}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentSold}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-gold-400">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-ink-faint">{label}</dt>
        {loading ? (
          <dd className="mt-1 h-4 w-20 animate-pulse rounded bg-surface-3" />
        ) : (
          <dd className="font-display text-sm font-semibold text-ink">{value}</dd>
        )}
      </div>
    </div>
  );
}
