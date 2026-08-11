import { Link } from 'react-router-dom';
import { Camera, Mail, Music2, PlaySquare, Ticket } from 'lucide-react';
import { Container } from '../ui/Container';
import { TrustBadges } from '../ui/TrustBadges';
import { mockOrganizer } from '../../mocks/organizer';

const FOOTER_LINKS = [
  {
    title: 'Campanha',
    links: [
      { label: 'Promoções', href: '/#pacotes' },
      { label: 'Como funciona', href: '/#como-funciona' },
      { label: 'Resultados', href: '/#resultados' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Regulamento completo', href: '/regulamento' },
      { label: 'Termos de uso', href: '/regulamento#termos' },
      { label: 'Política de privacidade', href: '/regulamento#privacidade' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/#topo" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#181103]">
                <Ticket size={18} strokeWidth={2.5} />
              </span>
              Rifa<span className="text-gradient-gold">Premiada</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-faint">
              Template de demonstração de campanha promocional. Preparado para operações legalmente
              autorizadas.
            </p>
            <div className="mt-5 flex gap-3">
              {[Camera, Music2, PlaySquare].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Rede social"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-faint transition-colors hover:border-gold-400/50 hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-ink">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-ink-faint transition-colors hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-ink">Contato</p>
            <a
              href="mailto:contato@exemplo-rifa-premiada.com.br"
              className="mt-4 flex items-center gap-2 text-sm text-ink-faint hover:text-ink"
            >
              <Mail size={14} /> contato@exemplo-rifa-premiada.com.br
            </a>
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              Responsável: {mockOrganizer.name}
              <br />
              {mockOrganizer.document}
            </p>
          </div>
        </div>

        <TrustBadges className="mt-10 border-t border-border-soft pt-8" />

        <div className="mt-8 flex flex-col gap-2 border-t border-border-soft pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rifa Premiada. Template de demonstração — dados fictícios.</p>
          <p>Participação sujeita ao regulamento completo desta campanha.</p>
        </div>
      </Container>
    </footer>
  );
}
