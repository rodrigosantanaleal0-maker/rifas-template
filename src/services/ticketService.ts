import { campaignStore } from '../lib/campaignStore';
import { createSeededRandom } from '../mocks/admin/_seed';
import type { AdminTicket } from '../types/admin';

/**
 * GET /api/admin/tickets
 *
 * A disponibilidade real dos números vem sempre do backend — o
 * frontend nunca deve ser tratado como fonte de verdade sobre quais
 * números estão livres, reservados ou vendidos.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAdminTickets(): Promise<AdminTicket[]> {
  if (USE_MOCKS) {
    const { totalNumbers, soldNumbers, reservedNumbers } = campaignStore.getState().availability;
    const random = createSeededRandom(4242);
    const tickets: AdminTicket[] = Array.from({ length: totalNumbers }, (_, i) => {
      const value = i + 1;
      if (value <= soldNumbers) return { value, status: 'sold' as const };
      if (value <= soldNumbers + reservedNumbers) return { value, status: 'reserved' as const };
      if (random() < 0.002) return { value, status: 'blocked' as const };
      return { value, status: 'available' as const };
    });
    return delay(tickets, 200);
  }
  const res = await fetch(`${API_BASE_URL}/api/admin/tickets`);
  if (!res.ok) throw new Error('Falha ao carregar números.');
  return res.json();
}
