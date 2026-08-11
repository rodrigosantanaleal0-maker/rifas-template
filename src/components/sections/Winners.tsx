import { useEffect, useState } from 'react';
import { ExternalLink, Trophy } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { getResults } from '../../lib/api';
import { formatDateLong } from '../../lib/format';
import type { RaffleResult } from '../../types';

export function Winners() {
  const [results, setResults] = useState<RaffleResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getResults().then((data) => {
      if (active) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="resultados" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="resultados-heading">
      <Container>
        <SectionHeading
          eyebrow="Histórico"
          title={<span id="resultados-heading">Resultados</span>}
          description="Resultados públicos de campanhas encerradas, com identificação parcial conforme regulamento."
        />

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface-2" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ink-faint">
            Nenhum resultado divulgado até o momento.
          </p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {results.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                    <Trophy size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {r.campaignTitle}
                    </p>
                    <p className="mt-1 font-display font-bold text-ink">{r.prizeName}</p>
                    <p className="mt-1 text-sm text-ink-muted">{formatDateLong(r.drawDateISO)}</p>
                    <p className="mt-2 text-sm text-ink-muted">{r.winnerIdentifier}</p>
                    {r.proofUrl && (
                      <a
                        href={r.proofUrl}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:underline"
                      >
                        Ver comprovante <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
