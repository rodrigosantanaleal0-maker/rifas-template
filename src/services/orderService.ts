import { mockOrders } from '../mocks/admin/orders';
import type { AdminOrder, OrderStatus } from '../types/admin';

/** GET /api/admin/orders · GET /api/admin/orders/:id */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface OrderQuery {
  status?: OrderStatus | 'all';
  search?: string;
  page: number;
  pageSize: number;
}

export async function getOrders(query: OrderQuery): Promise<PagedResult<AdminOrder>> {
  if (USE_MOCKS) {
    let filtered = mockOrders;
    if (query.status && query.status !== 'all') {
      filtered = filtered.filter((o) => o.status === query.status);
    }
    if (query.search?.trim()) {
      const term = query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.code.toLowerCase().includes(term) ||
          o.participantName.toLowerCase().includes(term) ||
          o.participantEmail.toLowerCase().includes(term),
      );
    }
    const start = query.page * query.pageSize;
    return delay({ items: filtered.slice(start, start + query.pageSize), total: filtered.length });
  }

  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    ...(query.status && query.status !== 'all' ? { status: query.status } : {}),
    ...(query.search ? { search: query.search } : {}),
  });
  const res = await fetch(`${API_BASE_URL}/api/admin/orders?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao carregar pedidos.');
  return res.json();
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  if (USE_MOCKS) return delay(mockOrders.find((o) => o.id === id) ?? null, 150);
  const res = await fetch(`${API_BASE_URL}/api/admin/orders/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return res.json();
}
