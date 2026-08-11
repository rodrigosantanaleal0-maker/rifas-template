import { mockResultRecords } from '../mocks/admin/results';
import { recordAudit } from './auditService';
import type { ResultRecord } from '../types/admin';

/**
 * GET  /api/admin/results
 * POST /api/admin/results/:id/publish
 *
 * Nunca inventar vencedores na interface. O resultado só deve ser
 * publicado depois da apuração real, conforme o mecanismo legal
 * aplicável (ex.: Loteria Federal), e o backend deve validar a
 * autorização e a integridade dos documentos anexados.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let store: ResultRecord[] = [...mockResultRecords];

export async function getResults(): Promise<ResultRecord[]> {
  if (USE_MOCKS) return delay(store, 200);
  const res = await fetch(`${API_BASE_URL}/api/admin/results`);
  if (!res.ok) throw new Error('Falha ao carregar resultados.');
  store = await res.json();
  return store;
}

export interface PublishResultInput {
  winnerName: string;
  winnerDocumentMasked: string;
  winningNumber: number;
  proofDocumentName: string | null;
}

export async function publishResult(id: string, data: PublishResultInput, actorName: string): Promise<ResultRecord> {
  if (USE_MOCKS) {
    await delay(null, 500);
    store = store.map((r) =>
      r.id === id ? { ...r, ...data, status: 'published', publishedAtISO: new Date().toISOString() } : r,
    );
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/results/${encodeURIComponent(id)}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao publicar resultado.');
    const updated = (await res.json()) as ResultRecord;
    store = store.map((r) => (r.id === id ? updated : r));
  }

  recordAudit({
    actorName,
    field: 'Resultado da campanha',
    previousValue: 'Aguardando apuração',
    newValue: `Publicado — número ${data.winningNumber}`,
  });

  return store.find((r) => r.id === id)!;
}
