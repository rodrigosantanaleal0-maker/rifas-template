import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/ui/Container';
import { mockCampaign } from '../mocks/campaign';
import { mockOrganizer } from '../mocks/organizer';
import { formatDateLong } from '../lib/format';

const SECTIONS = [
  {
    id: 'objeto',
    title: '1. Objeto da campanha',
    body: `Este documento estabelece as regras de participação na campanha "${mockCampaign.title}", organizada por ${mockOrganizer.name}. Este é um template de demonstração — o texto abaixo é ilustrativo e deve ser substituído pelo regulamento jurídico real antes de qualquer operação em produção.`,
  },
  {
    id: 'elegibilidade',
    title: '2. Elegibilidade',
    body: 'Podem participar pessoas físicas maiores de 18 anos, residentes no território nacional, que realizem o pagamento por um dos meios autorizados descritos nesta página.',
  },
  {
    id: 'participacao',
    title: '3. Participação e valores',
    body: `Cada número tem o valor unitário informado na página inicial. A quantidade total de números desta campanha é de ${mockCampaign.totalNumbers.toLocaleString('pt-BR')}. A disponibilidade é controlada exclusivamente pelo backend da plataforma.`,
  },
  {
    id: 'apuracao',
    title: '4. Método de apuração',
    body: 'O método de apuração (ex.: loteria federal, sorteio eletrônico auditado ou outro mecanismo autorizado) deve ser detalhado aqui, incluindo o processo de verificação e auditoria aplicável.',
  },
  {
    id: 'resultado',
    title: '5. Data e divulgação do resultado',
    body: `A apuração está prevista para ${formatDateLong(mockCampaign.drawDateISO)}. O resultado será divulgado publicamente na seção "Resultados" deste site.`,
  },
  {
    id: 'premio',
    title: '6. Prêmio e entrega',
    body: 'A descrição completa do prêmio, prazos e condições de entrega devem ser detalhados nesta seção antes da publicação em produção.',
  },
  {
    id: 'cancelamento',
    title: '7. Cancelamento e reembolso',
    body: 'As condições em que a participação pode ser cancelada ou reembolsada devem ser especificadas aqui, em conformidade com a legislação aplicável.',
  },
  {
    id: 'responsavel',
    title: '8. Responsável pela organização',
    body: `${mockOrganizer.name} — ${mockOrganizer.document}. Contato: contato@exemplo-rifa-premiada.com.br.`,
  },
  {
    id: 'termos',
    title: '9. Termos de uso',
    body: 'Ao participar desta campanha, o usuário concorda com as regras descritas neste regulamento e com as condições gerais de uso da plataforma.',
  },
  {
    id: 'privacidade',
    title: '10. Política de privacidade',
    body: 'Os dados pessoais coletados (nome, e-mail, CPF) são utilizados exclusivamente para viabilizar a participação e a comunicação sobre a campanha, em conformidade com a Lei Geral de Proteção de Dados (LGPD). Nenhum dado sensível é armazenado desnecessariamente no navegador.',
  },
  {
    id: 'contato',
    title: '11. Contato',
    body: 'Dúvidas sobre este regulamento podem ser enviadas para contato@exemplo-rifa-premiada.com.br.',
  },
];

export function Regulation() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={15} /> Voltar
          </Link>

          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Regulamento completo
          </h1>
          <p className="mt-3 rounded-xl border border-gold-500/25 bg-gold-500/5 px-4 py-3 text-sm text-ink-muted">
            Documento de demonstração. Todo o conteúdo abaixo é ilustrativo e deve ser revisado por
            profissional jurídico habilitado antes da publicação em produção.
          </p>

          <div className="mt-10 space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-display text-lg font-bold text-ink">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{section.body}</p>
              </section>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
