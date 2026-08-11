import { motion } from 'framer-motion';
import { Flame, Ticket } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { useCountUp } from '../../hooks/useCountUp';
import type { AvailabilitySnapshot } from '../../types';
import { cn } from '../../lib/cn';

const MILESTONES = [25, 50, 75];
const LOW_STOCK_THRESHOLD = 80;

interface AvailabilityBarProps {
  availability: AvailabilitySnapshot | null;
  loading?: boolean;
}

export function AvailabilityBar({ availability, loading }: AvailabilityBarProps) {
  const total = availability?.totalNumbers ?? 0;
  const sold = availability?.soldNumbers ?? 0;
  const percentSold = total > 0 ? Math.round((sold / total) * 100) : 0;
  const percentLeft = 100 - percentSold;
  const isLowStock = percentSold >= LOW_STOCK_THRESHOLD;

  const { ref, value: animatedPercent } = useCountUp(percentSold);

  return (
    <section className="py-12 sm:py-16" aria-labelledby="disponibilidade-heading">
      <Container>
        <Reveal
          className={cn(
            'mx-auto max-w-3xl rounded-3xl border p-6 sm:p-8 transition-colors',
            isLowStock ? 'border-ruby-500/30 bg-ruby-500/[0.04]' : 'border-border bg-surface',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl',
                  isLowStock ? 'bg-ruby-500/10 text-ruby-400' : 'bg-gold-500/10 text-gold-400',
                )}
              >
                <Ticket size={18} />
              </span>
              <h2 id="disponibilidade-heading" className="font-display text-lg font-bold text-ink">
                Números disponíveis
              </h2>
            </div>
            {isLowStock && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ruby-400">
                <Flame size={14} /> Restam {percentLeft}%
              </span>
            )}
          </div>

          <div ref={ref as React.RefObject<HTMLDivElement>} className="mt-6">
            <div className="flex items-end justify-between">
              {loading ? (
                <div className="h-10 w-40 animate-pulse rounded-lg bg-surface-3" />
              ) : (
                <span className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                  {animatedPercent}%<span className="ml-1 text-lg font-medium text-ink-muted">vendidos</span>
                </span>
              )}
              <span className="text-sm text-ink-faint">
                {loading ? '—' : `${sold.toLocaleString('pt-BR')} / ${total.toLocaleString('pt-BR')}`}
              </span>
            </div>

            <div className="relative mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-surface-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentSold}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative h-full rounded-full bg-[length:200%_100%]',
                    isLowStock
                      ? 'bg-gradient-to-r from-ruby-500 via-ruby-400 to-ruby-500'
                      : 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400',
                  )}
                >
                  <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%]" />
                </motion.div>
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center" aria-hidden>
                {MILESTONES.map((m) => (
                  <span
                    key={m}
                    className="absolute h-3 w-px -translate-x-1/2 bg-bg/60"
                    style={{ left: `${m}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-1.5 flex justify-between text-[10px] text-ink-faint" aria-hidden>
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <p className="mt-4 text-sm text-ink-muted">
              Restam <strong className="text-ink">{percentLeft}%</strong> dos números disponíveis para esta
              campanha. Disponibilidade validada em tempo real pelo servidor.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
