import { mockParticipants } from '../mocks/admin/participants';
import type { AdminParticipant } from '../types/admin';
import type { PagedResult } from './orderService';

/** GET /api/admin/participants */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export type ParticipantSort = 'recent' | 'mostSpent' | 'mostParticipations' | 'name';

export interface ParticipantQuery {
  search?: string;
  sort: ParticipantSort;
  page: number;
  pageSize: number;
}

function sortParticipants(items: AdminParticipant[], sort: ParticipantSort): AdminParticipant[] {
  const copy = [...items];
  switch (sort) {
    case 'mostSpent':
      return copy.sort((a, b) => b.totalSpentCents - a.totalSpentCents);
    case 'mostParticipations':
      return copy.sort((a, b) => b.participations - a.participations);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'recent':
    default:
      return copy.sort((a, b) => (b.lastParticipationISO ?? '').localeCompare(a.lastParticipationISO ?? ''));
  }
}

export async function getParticipants(query: ParticipantQuery): Promise<PagedResult<AdminParticipant>> {
  if (USE_MOCKS) {
    let filtered = mockParticipants;
    if (query.search?.trim()) {
      const term = query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term),
      );
    }
    const sorted = sortParticipants(filtered, query.sort);
    const start = query.page * query.pageSize;
    return delay({ items: sorted.slice(start, start + query.pageSize), total: sorted.length });
  }

  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sort: query.sort,
    ...(query.search ? { search: query.search } : {}),
  });
  const res = await fetch(`${API_BASE_URL}/api/admin/participants?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao carregar participantes.');
  return res.json();
}
