import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Pagination } from '../../components/admin/Pagination';
import { EmptyState } from '../../components/admin/EmptyState';
import { OrderStatusBadge } from '../../components/admin/OrderStatusBadge';
import { Drawer } from '../../components/admin/Drawer';
import { Button } from '../../components/ui/Button';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import * as orderService from '../../services/orderService';
import { formatCurrencyBRL, formatDateTime } from '../../lib/format';
import { cn } from '../../lib/cn';
import type { AdminOrder, OrderStatus } from '../../types/admin';

const FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'paid', label: 'Pagos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'expired', label: 'Expirados' },
  { value: 'refunded', label: 'Reembolsados' },
];

const PAGE_SIZE = 10;

export function Orders() {
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  useEffect(() => setPage(0), [status, debouncedSearch]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    orderService.getOrders({ status, search: debouncedSearch, page, pageSize: PAGE_SIZE }).then((res) => {
      if (!active) return;
      setItems(res.items);
      setTotal(res.total);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [status, debouncedSearch, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Pedidos</h1>
        <p className="mt-1 text-sm text-ink-muted">Acompanhe vendas e status de pagamento.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                status === f.value ? 'bg-gold-500 text-[#181103]' : 'text-ink-muted hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar pedido…"
            className="input-field pl-9"
          />
        </div>
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
              icon={<ShoppingCart size={20} />}
              title="Nenhum pedido encontrado"
              description="Ajuste os filtros ou o termo de busca."
            />
          </div>
        ) : (
          <>
            <div className="divide-y divide-border-soft sm:hidden">
              {items.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="flex w-full flex-col gap-1.5 px-4 py-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{order.code}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-ink-muted">{order.participantName}</p>
                  <div className="flex items-center justify-between text-xs text-ink-faint">
                    <span>{order.quantity} números</span>
                    <span className="font-medium text-ink">{formatCurrencyBRL(order.totalCents)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">Participante</th>
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Qtd.</th>
                    <th className="px-5 py-3 font-semibold">Valor</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Pagamento</th>
                    <th className="px-5 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((order) => (
                    <tr key={order.id} className="border-b border-border-soft last:border-0 hover:bg-surface-2">
                      <td className="px-5 py-3.5 font-medium text-ink">{order.code}</td>
                      <td className="px-5 py-3.5 text-ink-muted">{order.participantName}</td>
                      <td className="px-5 py-3.5 text-ink-faint">{formatDateTime(order.createdAtISO)}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink-muted">{order.quantity}</td>
                      <td className="px-5 py-3.5 font-medium tabular-nums text-ink">
                        {formatCurrencyBRL(order.totalCents)}
                      </td>
                      <td className="px-5 py-3.5">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3.5 text-ink-faint">
                        {order.paymentMethod === 'pix' ? 'Pix' : 'Cartão'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="md"
                          className="!px-3 !py-1.5 !text-xs"
                          onClick={() => setSelected(order)}
                        >
                          Ver detalhes
                        </Button>
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

      <Drawer open={selected != null} onClose={() => setSelected(null)} title={selected ? `Pedido ${selected.code}` : ''}>
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <OrderStatusBadge status={selected.status} />
              <span className="text-xs text-ink-faint">{formatDateTime(selected.createdAtISO)}</span>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="ID" value={selected.id} />
              <DetailRow label="Participante" value={selected.participantName} />
              <DetailRow label="E-mail" value={selected.participantEmail} />
              <DetailRow label="Telefone" value={selected.participantPhone} />
              <DetailRow label="Quantidade" value={String(selected.quantity)} />
              <DetailRow label="Valor" value={formatCurrencyBRL(selected.totalCents)} />
              <DetailRow
                label="Forma de pagamento"
                value={selected.paymentMethod === 'pix' ? 'Pix' : 'Cartão de crédito'}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Números associados</p>
              <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                {selected.numbers.map((n) => (
                  <span key={n} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-ink-muted">
                    {String(n).padStart(5, '0')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Histórico</p>
              <ul className="space-y-2 border-l border-border-soft pl-4">
                {selected.history.map((h, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-ink">{h.label}</p>
                    <p className="text-xs text-ink-faint">{formatDateTime(h.atISO)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={`/admin/participants?search=${encodeURIComponent(selected.participantEmail)}`}>
              <Button variant="outline" className="w-full">
                Ver participante
              </Button>
            </Link>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border-soft pb-2 last:border-0">
      <span className="text-ink-faint">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-ink">{value}</span>
    </div>
  );
}
