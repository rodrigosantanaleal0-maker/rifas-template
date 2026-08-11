import { Link } from 'react-router-dom';
import {
  CalendarClock,
  FileCheck2,
  Gavel,
  Landmark,
  Lock,
  Mail,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { mockCampaign } from '../../mocks/campaign';
import { mockOrganizer } from '../../mocks/organizer';
import { formatDateLong } from '../../lib/format';

const ITEMS = [
  {
    icon: ScrollText,
    label: 'Regulamento',
    value: 'Documento completo com todas as regras da campanha',
  },
  {
    icon: CalendarClock,
    label: 'Período da campanha',
    value: `${formatDateLong(mockCampaign.startDateISO)} até a apuração`,
  },
  {
    icon: FileCheck2,
    label: 'Critérios de participação',
    value: 'Maiores de 18 anos, conforme regulamento completo',
  },
  {
    icon: Gavel,
    label: 'Método de apuração',
    value: 'Detalhado na íntegra no regulamento completo',
  },
  {
    icon: CalendarClock,
    label: 'Data do resultado',
    value: formatDateLong(mockCampaign.drawDateISO),
  },
  {
    icon: Landmark,
    label: 'Responsável',
    value: `${mockOrganizer.name} — ${mockOrganizer.document}`,
  },
  {
    icon: ShieldCheck,
    label: 'Informações legais',
    value: 'Conformidade com a legislação vigente aplicável',
  },
  {
    icon: Lock,
    label: 'Privacidade',
    value: 'Política de privacidade e proteção de dados (LGPD)',
  },
];

export function Transparency() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="transparencia-heading">
      <Container>
        <SectionHeading
          eyebrow="Confiança"
          title={<span id="transparencia-heading">Transparência</span>}
          description="Todas as informações relevantes sobre esta campanha, reunidas em um só lugar."
        />

        <Reveal className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-gold-400">
                <item.icon size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{item.value}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link to="/regulamento">
            <Button variant="outline" size="lg">
              Ver regulamento completo
            </Button>
          </Link>
          <a href="mailto:contato@exemplo-rifa-premiada.com.br" className="flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink-muted">
            <Mail size={14} /> contato@exemplo-rifa-premiada.com.br
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
