import { BadgeCheck, Star, UserCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { mockTestimonials } from '../../mocks/testimonials';
import { formatDateShort } from '../../lib/format';

export function Testimonials() {
  const averageRating =
    mockTestimonials.reduce((sum, t) => sum + t.rating, 0) / (mockTestimonials.length || 1);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="depoimentos-heading">
      <Container>
        <SectionHeading
          eyebrow="Comunidade"
          title={<span id="depoimentos-heading">Quem já participou</span>}
          description="Depoimentos de participantes de campanhas anteriores."
        />

        <Reveal className="mx-auto mt-8 flex max-w-fit items-center gap-3 rounded-full border border-border bg-surface px-5 py-2.5">
          <div className="flex items-center gap-1 text-gold-400">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                size={14}
                fill={s < Math.round(averageRating) ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-ink">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-ink-faint">· {mockTestimonials.length} avaliações verificadas</span>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockTestimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border/80">
                <div className="flex items-center gap-1 text-gold-400" aria-label={`Avaliação: ${t.rating} de 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill={s < t.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                  “{t.comment}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border-soft pt-4">
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-2 text-ink-faint">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle2 size={20} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-sm font-semibold text-ink">
                      {t.name}
                      <BadgeCheck size={13} className="shrink-0 text-emerald-400" aria-label="Participação verificada" />
                    </p>
                    <p className="text-xs text-ink-faint">{formatDateShort(t.dateISO)}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          Depoimentos de demonstração. Em produção, exibir apenas avaliações reais e verificadas.
        </p>
      </Container>
    </section>
  );
}
