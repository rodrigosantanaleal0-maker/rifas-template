import type { TicketPackage } from '../types';

/** DADOS FICTÍCIOS — apenas para demonstração visual do template. */
export const mockPackages: TicketPackage[] = [
  {
    id: 'pkg_1',
    quantity: 1,
    priceCents: 250,
    perksLabel: 'Participação avulsa',
  },
  {
    id: 'pkg_10',
    quantity: 10,
    priceCents: 2200,
    originalPriceCents: 2500,
    badge: 'Mais escolhido',
    highlighted: true,
    perksLabel: '12% de desconto',
  },
  {
    id: 'pkg_50',
    quantity: 50,
    priceCents: 10000,
    originalPriceCents: 12500,
    badge: 'Melhor custo',
    perksLabel: '20% de desconto',
  },
  {
    id: 'pkg_100',
    quantity: 100,
    priceCents: 18000,
    originalPriceCents: 25000,
    perksLabel: '28% de desconto',
  },
];
