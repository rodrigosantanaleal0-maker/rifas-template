import type { ResultRecord } from '../../types/admin';

/**
 * DEMO DATA — nenhum vencedor real é representado aqui. Em produção,
 * resultados só devem ser publicados via `resultService.publish()` após
 * a apuração conforme o mecanismo legal aplicável, nunca inventados na
 * interface. Ver src/services/resultService.ts.
 */
export const mockResultRecords: ResultRecord[] = [
  {
    id: 'result_demo_current',
    campaignId: 'camp_demo_01',
    campaignTitle: 'Campanha Promocional Oficial',
    status: 'awaiting',
    drawDateISO: '2026-09-20T20:00:00-03:00',
    winnerName: null,
    winnerDocumentMasked: null,
    winningNumber: null,
    method: 'Loteria Federal',
    proofDocumentName: null,
    publishedAtISO: null,
  },
  {
    id: 'result_demo_previous',
    campaignId: 'camp_demo_00',
    campaignTitle: 'Campanha exemplo #04 (encerrada)',
    status: 'published',
    drawDateISO: '2026-06-10T20:00:00-03:00',
    winnerName: 'Vencedor não divulgado',
    winnerDocumentMasked: 'CPF ***.***.***-00',
    winningNumber: 8421,
    method: 'Loteria Federal',
    proofDocumentName: 'comprovante-apuracao-demo.pdf',
    publishedAtISO: '2026-06-11T09:00:00-03:00',
  },
];
