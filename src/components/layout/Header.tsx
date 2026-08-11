import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Ticket, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { mockOrganizer } from '../../mocks/organizer';
import { useCampaignData } from '../../hooks/useCampaignData';

const STATUS_BADGE = {
  active: { label: 'Campanha ativa', tone: 'gold' as const, pulse: true },
  paused: { label: 'Campanha pausada', tone: 'violet' as const, pulse: false },
  finished: { label: 'Campanha encerrada', tone: 'neutral' as const, pulse: false },
};

const NAV_LINKS = [
  { label: 'Início', href: '/#topo' },
  { label: 'Promoções', href: '/#pacotes' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Resultados', href: '/#resultados' },
  { label: 'FAQ', href: '/#faq' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { campaign } = useCampaignData();
  const statusBadge = STATUS_BADGE[campaign?.status ?? 'active'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border-soft' : 'border-b border-transparent'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link to="/#topo" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#181103]">
              <Ticket size={18} strokeWidth={2.5} />
            </span>
            Rifa<span className="text-gradient-gold">Premiada</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Badge tone={statusBadge.tone} pulse={statusBadge.pulse} className="hidden xl:inline-flex">
              {statusBadge.label}
            </Badge>
            <div
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-gold-400/50 bg-surface-2 bg-cover bg-center"
              role="img"
              aria-label={`Avatar de ${mockOrganizer.name}`}
              style={
                mockOrganizer.avatarUrl ? { backgroundImage: `url(${mockOrganizer.avatarUrl})` } : undefined
              }
            />
            <a href="/#pacotes" className="relative">
              <span className="absolute inset-0 -z-10 rounded-full bg-gold-500/40 blur-lg animate-glow-pulse" aria-hidden />
              <Button size="md">Ver promoções</Button>
            </a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <a href="/#pacotes">
              <Button size="md" className="!px-4 !py-2 !text-xs">
                Participar
              </Button>
            </a>
            <button
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border-soft glass lg:hidden"
            aria-label="Navegação móvel"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
