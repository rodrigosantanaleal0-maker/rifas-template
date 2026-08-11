import type { AuditLogEntry } from '../types/admin';

/**
 * Histórico administrativo (quem alterou o quê, quando). Em produção
 * isto deve ser gravado pelo backend a cada mutação autorizada — o
 * frontend só reflete o que o backend confirmar. Aqui persiste em
 * localStorage para sobreviver a reloads durante o desenvolvimento.
 */
const STORAGE_KEY = 'packlp_demo_audit_log_v1';

function load(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
  } catch {
    return [];
  }
}

let entries: AuditLogEntry[] = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignora falha de storage — histórico segue válido em memória */
  }
}

export function recordAudit(input: Omit<AuditLogEntry, 'id' | 'atISO'>) {
  const entry: AuditLogEntry = {
    ...input,
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    atISO: new Date().toISOString(),
  };
  entries = [entry, ...entries].slice(0, 200);
  persist();
  listeners.forEach((listener) => listener());
}

export function getAuditLog(): AuditLogEntry[] {
  return entries;
}

export function subscribeAuditLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
