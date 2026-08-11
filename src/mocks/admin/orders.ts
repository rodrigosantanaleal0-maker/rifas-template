import type { AdminOrder, OrderStatus } from '../../types/admin';
import type { PaymentMethod } from '../../types';
import { mockParticipants } from './participants';
import { createSeededRandom, pick } from './_seed';

/**
 * DEMO DATA — pedidos fictícios gerados deterministicamente para o
 * PackLP Admin. Em produção, ler via `orderService` (GET /api/admin/orders).
 */
const ORDER_COUNT = 220;
const STATUS_WEIGHTS: [OrderStatus, number][] = [
  ['paid', 0.62],
  ['pending', 0.19],
  ['cancelled', 0.08],
  ['expired', 0.07],
  ['refunded', 0.04],
];
const PAYMENT_METHODS: PaymentMethod[] = ['pix', 'credit_card'];

function weightedStatus(random: () => number): OrderStatus {
  const r = random();
  let acc = 0;
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight;
    if (r <= acc) return status;
  }
  return 'paid';
}

const random = createSeededRandom(9042);

export const mockOrders: AdminOrder[] = Array.from({ length: ORDER_COUNT }, (_, i) => {
  const index = i + 1;
  const participant = pick(random, mockParticipants);
  const quantity = 5 + Math.floor(random() * 80);
  const priceCents = 250;
  const daysAgo = random() * 45;
  const createdAt = new Date(Date.now() - daysAgo * 86_400_000);
  const status = weightedStatus(random);
  const numbers = Array.from({ length: Math.min(quantity, 12) }, () => 1 + Math.floor(random() * 20000));

  const history = [{ atISO: createdAt.toISOString(), label: 'Pedido criado' }];
  if (status === 'paid') {
    history.push({ atISO: new Date(createdAt.getTime() + 6 * 60_000).toISOString(), label: 'Pagamento confirmado' });
  } else if (status === 'cancelled') {
    history.push({ atISO: new Date(createdAt.getTime() + 20 * 60_000).toISOString(), label: 'Pedido cancelado' });
  } else if (status === 'expired') {
    history.push({ atISO: new Date(createdAt.getTime() + 30 * 60_000).toISOString(), label: 'Prazo de pagamento expirado' });
  } else if (status === 'refunded') {
    history.push({ atISO: new Date(createdAt.getTime() + 6 * 60_000).toISOString(), label: 'Pagamento confirmado' });
    history.push({ atISO: new Date(createdAt.getTime() + 2 * 86_400_000).toISOString(), label: 'Pedido reembolsado' });
  }

  return {
    id: `ord_demo_${String(index).padStart(4, '0')}`,
    code: `#${String(10000 + index)}`,
    participantId: participant.id,
    participantName: participant.name,
    participantEmail: participant.email,
    participantPhone: participant.phone,
    createdAtISO: createdAt.toISOString(),
    quantity,
    numbers,
    totalCents: quantity * priceCents,
    status,
    paymentMethod: pick(random, PAYMENT_METHODS),
    history,
  };
}).sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
