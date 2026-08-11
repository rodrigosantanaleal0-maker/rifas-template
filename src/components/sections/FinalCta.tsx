import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import type { Campaign } from '../../types';
import { formatDateLong } from '../../lib/format';

export function FinalCta({ campaign }: { campaign: Campaign | null }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-gold-500/30 bg-gradient-to-br from-violet-600/25 via-surface to-gold-500/15 px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-5xl">
              Ainda dá <span className="text-gradient-gold">tempo</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-ink-muted">
              Participe enquanto a campanha estiver disponível.
            </p>
            <div className="mt-8 flex justify-center">
              <a href="#pacotes">
                <Button size="lg" icon={<ArrowRight size={18} />}>
                  Participar agora
                </Button>
              </a>
            </div>
            {campaign && (
              <p className="mt-5 text-xs text-ink-faint">
                Encerramento das vendas conforme regulamento — apuração prevista para{' '}
                {formatDateLong(campaign.drawDateISO)}.
              </p>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
