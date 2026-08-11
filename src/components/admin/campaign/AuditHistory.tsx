import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { EmptyState } from '../EmptyState';
import { formatDateTime } from '../../../lib/format';
import * as auditService from '../../../services/auditService';
import type { AuditLogEntry } from '../../../types/admin';

export function AuditHistory() {
  const [entries, setEntries] = useState<AuditLogEntry[]>(auditService.getAuditLog());

  useEffect(() => auditService.subscribeAuditLog(() => setEntries(auditService.getAuditLog())), []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">Histórico de alterações</h2>
      <p className="mt-1 text-sm text-ink-muted">Quem alterou, o que mudou e quando.</p>

      {entries.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={<History size={20} />} title="Nenhuma alteração registrada ainda" />
        </div>
      ) : (
        <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {entries.slice(0, 30).map((entry) => (
            <li key={entry.id} className="rounded-xl border border-border-soft bg-surface-2 p-3.5 text-sm">
              <p className="text-ink-muted">
                <span className="font-semibold text-ink">{entry.actorName}</span> alterou{' '}
                <span className="font-semibold text-ink">{entry.field}</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
                <span className="rounded bg-ruby-500/10 px-1.5 py-0.5 text-ruby-400 line-through">
                  {entry.previousValue}
                </span>
                <span>→</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400">{entry.newValue}</span>
              </p>
              <p className="mt-1.5 text-xs text-ink-faint">{formatDateTime(entry.atISO)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
