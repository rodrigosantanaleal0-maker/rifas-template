import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';
import * as ticketService from '../../services/ticketService';
import type { AdminTicket, AdminTicketStatus } from '../../types/admin';

const PAGE_SIZE = 200;

const STATUS_META: Record<AdminTicketStatus, { label: string; className: string }> = {
  available: { label: 'Disponível', className: 'border-border bg-surface-2 text-ink-muted' },
  reserved: { label: 'Reservado', className: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
  sold: { label: 'Pago', className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  blocked: { label: 'Bloqueado', className: 'border-ruby-500/40 bg-ruby-500/10 text-ruby-400' },
};

export function Tickets() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminTicketStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    ticketService.getAdminTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = tickets;
    if (filter !== 'all') list = list.filter((t) => t.status === filter);
    if (search.trim()) list = list.filter((t) => String(t.value).includes(search.trim()));
    return list;
  }, [tickets, filter, search]);

  useEffect(() => setPage(0), [filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<AdminTicketStatus, number> = { available: 0, reserved: 0, sold: 0, blocked: 0 };
    tickets.forEach((t) => {
      c[t.status] += 1;
    });
    return c;
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Números</h1>
        <p className="mt-1 text-sm text-ink-muted">
          A disponibilidade exibida aqui vem do backend — o frontend nunca decide sozinho o que está livre.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-border bg-surface p-4">
        {(Object.keys(STATUS_META) as AdminTicketStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-2 text-sm">
            <span className={cn('h-3 w-3 rounded-sm border', STATUS_META[status].className)} />
            <span className="text-ink-muted">{STATUS_META[status].label}</span>
            <span className="font-semibold text-ink">{counts[status].toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1">
          {(['all', 'available', 'reserved', 'sold', 'blocked'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === f ? 'bg-gold-500 text-[#181103]' : 'text-ink-muted hover:text-ink',
              )}
            >
              {f === 'all' ? 'Todos' : STATUS_META[f].label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/\D/g, ''))}
            placeholder="Buscar número…"
            inputMode="numeric"
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        {loading ? (
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-12">
            {Array.from({ length: 70 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-surface-3" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-faint">Nenhum número encontrado.</p>
        ) : (
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-12">
            {pageItems.map((t) => (
              <span
                key={t.value}
                title={`${String(t.value).padStart(5, '0')} · ${STATUS_META[t.status].label}`}
                className={cn(
                  'rounded-md border px-1 py-1.5 text-center text-[10px] font-medium tabular-nums',
                  STATUS_META[t.status].className,
                )}
              >
                {String(t.value).padStart(5, '0')}
              </span>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4 text-sm">
            <p className="text-ink-faint">
              Página {page + 1} de {totalPages} · {filtered.length.toLocaleString('pt-BR')} números
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-30"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-30"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
