import { useEffect, useState } from 'react';
import { CheckCircle2, DollarSign, Percent, ShoppingCart, Ticket, Users } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { PeriodFilter } from '../../components/admin/PeriodFilter';
import { LineChart } from '../../components/admin/charts/LineChart';
import { BarChart } from '../../components/admin/charts/BarChart';
import { useCampaignData } from '../../hooks/useCampaignData';
import * as analyticsService from '../../services/analyticsService';
import { formatCurrencyBRL } from '../../lib/format';
import type { AnalyticsPeriod, DashboardMetrics, TimeSeriesPoint } from '../../types/admin';

function formatChartDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function Analytics() {
  const { availability } = useCampaignData();
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [series, setSeries] = useState<TimeSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([analyticsService.getDashboardMetrics(period), analyticsService.getTimeSeries()]).then(([m, s]) => {
      if (!active) return;
      setMetrics(m);
      setSeries(s);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [period]);

  const filtered = analyticsService.filterSeriesByPeriod(series, period);
  const labels = filtered.map((p) => formatChartDay(p.dateISO));
  const ticketAvg = metrics && metrics.ordersPaid > 0 ? metrics.revenueCents / metrics.ordersPaid : 0;
  const totalOrders = (metrics?.ordersPaid ?? 0) + (metrics?.ordersPending ?? 0);
  const conversion = totalOrders > 0 ? ((metrics?.ordersPaid ?? 0) / totalOrders) * 100 : 0;
  const available = availability ? availability.totalNumbers - availability.soldNumbers - availability.reservedNumbers : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-ink-muted">Métricas detalhadas de desempenho da campanha.</p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Receita"
          value={formatCurrencyBRL(metrics?.revenueCents ?? 0)}
          icon={<DollarSign size={16} />}
          deltaPct={metrics?.revenueDeltaPct}
          loading={loading}
        />
        <StatCard label="Pedidos pagos" value={String(metrics?.ordersPaid ?? 0)} icon={<CheckCircle2 size={16} />} loading={loading} />
        <StatCard label="Participantes" value={String(metrics?.participantsCount ?? 0)} icon={<Users size={16} />} loading={loading} />
        <StatCard label="Conversão" value={`${conversion.toFixed(1)}%`} icon={<Percent size={16} />} loading={loading} />
        <StatCard label="Ticket médio" value={formatCurrencyBRL(ticketAvg)} icon={<ShoppingCart size={16} />} loading={loading} />
        <StatCard
          label="Números vendidos"
          value={(availability?.soldNumbers ?? 0).toLocaleString('pt-BR')}
          icon={<Ticket size={16} />}
          loading={loading}
        />
        <StatCard label="Números disponíveis" value={available.toLocaleString('pt-BR')} icon={<Ticket size={16} />} loading={loading} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Receita ao longo do tempo</h2>
        <div className="mt-4">
          <LineChart
            labels={labels}
            series={[
              {
                key: 'revenue',
                label: 'Receita',
                color: 'var(--color-gold-400)',
                values: filtered.map((p) => p.revenueCents / 100),
              },
            ]}
            formatValue={(v) => formatCurrencyBRL(v * 100)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-ink">Participações</h2>
          <div className="mt-4">
            <LineChart
              labels={labels}
              series={[
                {
                  key: 'participations',
                  label: 'Participações',
                  color: 'var(--color-violet-400)',
                  values: filtered.map((p) => p.participations),
                },
              ]}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-ink">Pedidos pagos x pendentes</h2>
          <div className="mt-4">
            <BarChart
              labels={labels}
              series={[
                {
                  key: 'paid',
                  label: 'Pagos',
                  color: 'var(--color-emerald-400)',
                  values: filtered.map((p) => p.ordersPaid),
                },
                {
                  key: 'pending',
                  label: 'Pendentes',
                  color: 'var(--color-ruby-400)',
                  values: filtered.map((p) => p.ordersPending),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
