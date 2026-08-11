import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { useFaqData } from '../../hooks/useFaqData';

export function Faq() {
  const faqItems = useFaqData();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="faq-heading">
      <Container>
        <SectionHeading eyebrow="Dúvidas" title={<span id="faq-heading">Perguntas frequentes</span>} />

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border-soft rounded-2xl border border-border bg-surface">
          {faqItems.map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <Reveal key={item.id} delay={i * 0.03}>
                <div>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left"
                    >
                      <span className="text-sm font-semibold text-ink sm:text-base">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-ink-faint transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold-400' : ''}`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4.5 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
