import { AtSign, BadgeCheck, Camera, Music2, PlaySquare, UserRound } from 'lucide-react';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { mockOrganizer } from '../../mocks/organizer';

const SOCIAL_ICONS = {
  instagram: Camera,
  tiktok: Music2,
  youtube: PlaySquare,
  x: AtSign,
};

export function InfluencerSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="responsavel-heading">
      <Container>
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl border border-border bg-gradient-to-b from-surface-2 to-surface p-8 text-center sm:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-300">
            <BadgeCheck size={14} /> Campanha oficial
          </span>

          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gold-400/40 bg-surface-3 text-ink-faint">
            {mockOrganizer.avatarUrl ? (
              <img src={mockOrganizer.avatarUrl} alt={mockOrganizer.name} className="h-full w-full object-cover" />
            ) : (
              <UserRound size={40} />
            )}
          </div>

          <div>
            <h2 id="responsavel-heading" className="font-display text-2xl font-bold text-ink">
              {mockOrganizer.name}
            </h2>
            <p className="text-sm text-ink-faint">
              {mockOrganizer.handle} · {mockOrganizer.document}
            </p>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-ink-muted">{mockOrganizer.bio}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {mockOrganizer.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink-muted transition-colors hover:border-gold-400/40 hover:text-ink"
                >
                  <Icon size={15} />
                  {social.handle}
                </a>
              );
            })}
          </div>

          <p className="max-w-lg text-xs text-ink-faint">
            Informações sobre o responsável pela promoção e organização da campanha. Identificação completa e
            dados de contato disponíveis na seção Transparência.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
