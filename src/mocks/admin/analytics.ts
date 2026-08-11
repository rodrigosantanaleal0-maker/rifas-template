import type { TimeSeriesPoint } from '../../types/admin';
import { mockOrders } from './orders';

/**
 * DEMO DATA — série histórica derivada dos pedidos fictícios de
 * `mockOrders`, agregada por dia. Em produção, ler via
 * `analyticsService` (GET /api/admin/analytics).
 */
const DAYS = 45;

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export const mockTimeSeries: TimeSeriesPoint[] = Array.from({ length: DAYS }, (_, i) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - (DAYS - 1 - i));
  date.setUTCHours(0, 0, 0, 0);
  const key = dayKey(date.toISOString());

  const ordersOfDay = mockOrders.filter((o) => dayKey(o.createdAtISO) === key);
  const paid = ordersOfDay.filter((o) => o.status === 'paid' || o.status === 'refunded');
  const pending = ordersOfDay.filter((o) => o.status === 'pending');

  return {
    dateISO: date.toISOString(),
    revenueCents: paid.reduce((sum, o) => sum + o.totalCents, 0),
    participations: new Set(ordersOfDay.map((o) => o.participantId)).size,
    ticketsSold: paid.reduce((sum, o) => sum + o.quantity, 0),
    ordersPaid: paid.length,
    ordersPending: pending.length,
  };
});
