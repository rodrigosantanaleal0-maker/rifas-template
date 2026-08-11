import type { RaffleResult } from '../types';

/**
 * DADOS FICTÍCIOS — estrutura de exemplo apenas.
 * Nenhum ganhador real é representado aqui. Em produção, estes
 * registros devem vir da API (GET /results) com identificação
 * parcial do participante, conforme regulamento e LGPD.
 */
export const mockResults: RaffleResult[] = [
  {
    id: 'res_1',
    campaignTitle: 'Campanha exemplo #04',
    prizeName: '[Prêmio placeholder]',
    drawDateISO: '2026-06-10T20:00:00-03:00',
    winnerIdentifier: 'Nome não divulgado — CPF ***.***.***-00',
    proofUrl: null,
  },
  {
    id: 'res_2',
    campaignTitle: 'Campanha exemplo #03',
    prizeName: '[Prêmio placeholder]',
    drawDateISO: '2026-04-15T20:00:00-03:00',
    winnerIdentifier: 'Nome não divulgado — CPF ***.***.***-00',
    proofUrl: null,
  },
];
