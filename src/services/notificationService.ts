import { mockNotifications } from '../mocks/admin/notifications';
import type { AdminNotification } from '../types/admin';

/**
 * GET /api/admin/notifications
 *
 * Em produção, notificações devem ser disparadas por eventos reais do
 * backend (novo pedido, pagamento confirmado, marcos da campanha) via
 * WebSocket/SSE — nunca fabricadas no frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let store: AdminNotification[] = [...mockNotifications];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): AdminNotification[] {
  return store;
}

export async function getNotifications(): Promise<AdminNotification[]> {
  if (USE_MOCKS) return delay(store, 150);
  const res = await fetch(`${API_BASE_URL}/api/admin/notifications`);
  if (!res.ok) throw new Error('Falha ao carregar notificações.');
  store = await res.json();
  return store;
}

export async function markAsRead(id: string): Promise<void> {
  store = store.map((n) => (n.id === id ? { ...n, readAtISO: new Date().toISOString() } : n));
  emit();
  if (!USE_MOCKS) {
    await fetch(`${API_BASE_URL}/api/admin/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST',
    }).catch(() => {});
  }
}

export async function markAllAsRead(): Promise<void> {
  store = store.map((n) => (n.readAtISO ? n : { ...n, readAtISO: new Date().toISOString() }));
  emit();
}
