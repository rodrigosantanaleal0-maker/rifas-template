import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { Pagination } from '../../components/admin/Pagination';
import { EmptyState } from '../../components/admin/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import * as participantService from '../../services/participantService';
import type { ParticipantSort } from '../../services/participantService';
import { formatCurrencyBRL, formatDateShort } from '../../lib/format';
import type { AdminParticipant } from '../../types/admin';

const SORT_OPTIONS: { value: ParticipantSort; label: string }[] = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'mostSpent', label: 'Maior gasto' },
  { value: 'mostParticipations', label: 'Mais participações' },
  { value: 'name', label: 'Nome (A-Z)' },
];

const PAGE_SIZE = 10;

export function Participants() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [sort, setSort] = useState<ParticipantSort>('recent');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminParticipant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => setPage(0), [debouncedSearch, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    participantService.getParticipants({ search: debouncedSearch, sort, page, pageSize: PAGE_SIZE }).then((res) => {
      if (!active) return;
      setItems(res.items);
      setTotal(res.total);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [debouncedSearch, sort, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Participantes</h1>
        <p className="mt-1 text-sm text-ink-muted">Pessoas que já participaram desta campanha.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou e-mail…"
            className="input-field pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as ParticipantSort)}
          className="input-field w-full sm:w-52"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-3" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Users size={20} />}
              title="Nenhum participante encontrado"
              description="Ajuste a busca para tentar novamente."
            />
          </div>
        ) : (
          <>
            <div className="divide-y divide-border-soft sm:hidden">
              {items.map((p) => (
                <div key={p.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink">{p.name}</p>
                    {p.status === 'blocked' && <Badge tone="ruby">Bloqueado</Badge>}
                  </div>
                  <p className="text-sm text-ink-muted">{p.email}</p>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-ink-faint">
                    <span>{p.participations} participações</span>
                    <span className="font-medium text-ink">{formatCurrencyBRL(p.totalSpentCents)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Nome</th>
                    <th className="px-5 py-3 font-semibold">E-mail</th>
                    <th className="px-5 py-3 font-semibold">Telefone</th>
                    <th className="px-5 py-3 font-semibold">Participações</th>
                    <th className="px-5 py-3 font-semibold">Total gasto</th>
                    <th className="px-5 py-3 font-semibold">Última participação</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-border-soft last:border-0 hover:bg-surface-2">
                      <td className="px-5 py-3.5 font-medium text-ink">{p.name}</td>
                      <td className="px-5 py-3.5 text-ink-muted">{p.email}</td>
                      <td className="px-5 py-3.5 text-ink-faint">{p.phone}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink-muted">{p.participations}</td>
                      <td className="px-5 py-3.5 font-medium tabular-nums text-ink">
                        {formatCurrencyBRL(p.totalSpentCents)}
                      </td>
                      <td className="px-5 py-3.5 text-ink-faint">
                        {p.lastParticipationISO ? formatDateShort(p.lastParticipationISO) : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        {p.status === 'blocked' ? <Badge tone="ruby">Bloqueado</Badge> : <Badge tone="emerald">Ativo</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 pb-5">
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
