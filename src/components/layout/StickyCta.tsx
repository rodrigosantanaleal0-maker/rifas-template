import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Ticket } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrencyBRL } from '../../lib/format';
import type { Campaign } from '../../types';

export function StickyCta({ campaign }: { campaign: Campaign | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const heroHeight = window.innerHeight * 0.7;
      const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 200;
      setVisible(window.scrollY > heroHeight && !nearBottom);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 glass border-t border-border-soft px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                <Ticket size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-ink-faint">A partir de</p>
                <p className="font-display text-sm font-bold text-ink">
                  {campaign ? formatCurrencyBRL(campaign.numberPriceCents) : '—'}
                  <span className="ml-1 text-xs font-normal text-ink-faint">/ número</span>
                </p>
              </div>
            </div>
            <a href="#pacotes">
              <Button size="md" icon={<ArrowRight size={16} />} className="shrink-0">
                Participar
              </Button>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
