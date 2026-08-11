import { CreditCard, MailCheck, Ticket, Trophy } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { howItWorksSteps } from '../../mocks/howItWorks';

const ICONS = [Ticket, CreditCard, MailCheck, Trophy];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="como-funciona-heading">
      <Container>
        <SectionHeading
          eyebrow="Passo a passo"
          title={<span id="como-funciona-heading">Como funciona</span>}
          description="Um processo simples, transparente e rápido — do início da sua participação até o resultado."
        />

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute top-11 hidden h-px w-full bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden
          />
          {howItWorksSteps.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.step} delay={i * 0.08} className="relative">
                <div className="flex flex-col items-start rounded-2xl border border-border bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-magenta-500 text-white">
                      <Icon size={19} />
                    </span>
                    <span className="font-display text-2xl font-extrabold text-ink-faint">{item.step}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
