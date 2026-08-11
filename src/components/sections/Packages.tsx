import { motion } from 'framer-motion';
import { Check, Sparkles, Ticket } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { TrustBadges } from '../ui/TrustBadges';
import { mockPackages } from '../../mocks/packages';
import { formatCurrencyBRL } from '../../lib/format';
import { cn } from '../../lib/cn';

export function Packages({ onSelect }: { onSelect: (quantity: number) => void }) {
  return (
    <section id="pacotes" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="pacotes-heading">
      <Container>
        <SectionHeading
          eyebrow="Pacotes"
          title={<span id="pacotes-heading">Escolha sua participação</span>}
          description="Quanto maior o pacote, maior o desconto por número. Selecione a opção que combina com você."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockPackages.map((pkg, i) => {
            const unitPriceCents = pkg.priceCents / pkg.quantity;
            const savingsCents = pkg.originalPriceCents ? pkg.originalPriceCents - pkg.priceCents : 0;

            return (
              <Reveal key={pkg.id} delay={i * 0.06} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative h-full"
                >
                  {pkg.highlighted && (
                    <div
                      className="absolute -inset-[1.5px] rounded-2xl bg-[conic-gradient(var(--color-gold-300),var(--color-gold-500),var(--color-violet-500),var(--color-gold-300))] opacity-70 blur-[2px] animate-spin-slow"
                      aria-hidden
                    />
                  )}

                  <div
                    className={cn(
                      'relative flex h-full flex-col rounded-2xl border p-6',
                      pkg.highlighted
                        ? 'border-transparent bg-gradient-to-b from-surface to-surface shadow-[0_20px_50px_-20px_rgba(245,179,1,0.45)]'
                        : 'border-border bg-surface transition-colors hover:border-border/80',
                    )}
                  >
                    {pkg.badge && (
                      <span
                        className={cn(
                          'absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide',
                          pkg.highlighted
                            ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-[#181103]'
                            : 'bg-surface-3 text-ink-muted',
                        )}
                      >
                        {pkg.highlighted && <Sparkles size={12} />}
                        {pkg.badge}
                      </span>
                    )}

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-gold-400">
                      <Ticket size={16} />
                    </span>

                    <p className="mt-4 font-display text-3xl font-extrabold text-ink">{pkg.quantity}</p>
                    <p className="text-sm text-ink-muted">{pkg.quantity === 1 ? 'número' : 'números'}</p>

                    <div className="mt-5">
                      {pkg.originalPriceCents && (
                        <p className="text-sm text-ink-faint line-through">
                          {formatCurrencyBRL(pkg.originalPriceCents)}
                        </p>
                      )}
                      <p className="font-display text-2xl font-bold text-ink">
                        {formatCurrencyBRL(pkg.priceCents)}
                      </p>
                      <p className="text-xs text-ink-faint">{formatCurrencyBRL(unitPriceCents)} por número</p>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <Check size={15} /> {pkg.perksLabel}
                      </p>
                      {savingsCents > 0 && (
                        <p className="flex items-center gap-1.5 text-xs text-gold-400">
                          <Sparkles size={12} /> Economize {formatCurrencyBRL(savingsCents)}
                        </p>
                      )}
                    </div>

                    <Button
                      variant={pkg.highlighted ? 'primary' : 'outline'}
                      className="mt-6 w-full"
                      onClick={() => onSelect(pkg.quantity)}
                    >
                      Selecionar
                    </Button>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <TrustBadges className="justify-center" />
        </Reveal>
      </Container>
    </section>
  );
}
