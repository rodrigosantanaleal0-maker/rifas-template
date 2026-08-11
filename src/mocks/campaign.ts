import type { AvailabilitySnapshot, Campaign } from '../types';

/**
 * DADOS FICTÍCIOS — apenas para demonstração visual do template.
 * Em produção, substituir por chamada real via src/lib/api.ts.
 */
export const mockCampaign: Campaign = {
  id: 'camp_demo_01',
  slug: 'prova-premiada-demo',
  title: 'Campanha Promocional Oficial',
  tagline: 'Uma experiência exclusiva para nossa comunidade.',
  prizeName: '[PRÊMIO PRINCIPAL — placeholder]',
  prizeDescription:
    'Descrição detalhada do prêmio deve ser inserida aqui pelo organizador da campanha, incluindo especificações e condições de entrega.',
  prizeImageUrl: null,
  prizeEstimatedValueCents: 15000000,
  totalNumbers: 20000,
  numberPriceCents: 250,
  startDateISO: '2026-07-15T12:00:00-03:00',
  drawDateISO: '2026-09-20T20:00:00-03:00',
  status: 'active',
  organizerId: 'org_demo_01',
};

export const mockAvailability: AvailabilitySnapshot = {
  campaignId: 'camp_demo_01',
  totalNumbers: 20000,
  soldNumbers: 14400,
  reservedNumbers: 320,
  updatedAtISO: '2026-08-10T09:00:00-03:00',
};
