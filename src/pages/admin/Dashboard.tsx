import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Pause,
  Percent,
  Play,
  Square,
  UserCheck,
  Users,
} from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { PeriodFilter } from '../../components/admin/PeriodFilter';
import { LineChart } from '../../components/admin/charts/LineChart';
import { BarChart } from '../../components/admin/charts/BarChart';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useCampaignData } from '../../hooks/useCampaignData';
import * as analyticsService from '../../services/analyticsService';
import * as campaignService from '../../services/campaignService';
import { formatCurrencyBRL, formatDateLong } from '../../lib/format';
import type { AnalyticsPeriod, DashboardMetrics, TimeSeriesPoint } from '../../types/admin';
import type { CampaignStatus } from '../../types';

const STATUS_META: Record<CampaignStatus, { label: string; tone: 'gold' | 'violet' | 'neutral' }> = {
  active: { label: 'Ativa', tone: 'gold' },
  paused: { label: 'Pausada', tone: 'violet' },
  finished: { label: 'Encerrada', tone: 'neutral' },
};

function formatChartDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { campaign, availability, loading: campaignLoading } = useCampaignData();

  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [series, setSeries] = useState<TimeSeriesPoint[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [pendingAction, setPendingAction] = useState<'pause' | 'resume' | 'finish' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingMetrics(true);
    Promise.all([analyticsService.getDashboardMetrics(period), analyticsService.getTimeSeries()]).then(([m, s]) => {
      if (!active) return;
      setMetrics(m);
      setSeries(s);
      setLoadingMetrics(false);
    });
    return () => {
      active = false;
    };
  }, [period]);

  const filteredSeries = analyticsService.filterSeriesByPeriod(series, period);
  const labels = filteredSeries.map((p) => formatChartDay(p.dateISO));

  async function confirmAction() {
    if (!pendingAction || !user) return;
    setActionLoading(true);
    try {
      if (pendingAction === 'pause') {
        await campaignService.setCampaignStatus('paused', user.name);
        toast('Campanha pausada.');
      } else if (pendingAction === 'resume') {
        await campaignService.setCampaignStatus('active', user.name);
        toast('Campanha reativada.');
      } else {
        await campaignService.setCampaignStatus('finished', user.name);
        toast('Campanha encerrada.');
      }
    } catch {
      toast('Não foi possível concluir a ação.', 'error');
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }

  const soldPct =
    availability && availability.totalNumbers > 0
      ? Math.round((availability.soldNumbers / availability.totalNumbers) * 100)
      : 0;
  const status = campaign ? STATUS_META[campaign.status] : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Visão geral</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Olá, {user?.name.split(' ')[0]}. Aqui está o resumo da campanha.
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Faturamento"
          value={formatCurrencyBRL(metrics?.revenueCents ?? 0)}
          icon={<DollarSign size={16} />}
          deltaPct={metrics?.revenueDeltaPct}
          loading={loadingMetrics}
        />
        <StatCard
          label="Participações"
          value={String(metrics?.participations ?? 0)}
          icon={<Users size={16} />}
          deltaPct={metrics?.participationsDeltaPct}
          loading={loadingMetrics}
        />
        <StatCard label="Números vendidos" value={`${soldPct}%`} icon={<Percent size={16} />} loading={campaignLoading} />
        <StatCard label="Pedidos pagos" value={String(metrics?.ordersPaid ?? 0)} icon={<CheckCircle2 size={16} />} loading={loadingMetrics} />
        <StatCard label="Pedidos pendentes" value={String(metrics?.ordersPending ?? 0)} icon={<Clock size={16} />} loading={loadingMetrics} />
        <StatCard
          label="Participantes"
          value={String(metrics?.participantsCount ?? 0)}
          icon={<UserCheck size={16} />}
          loading={loadingMetrics}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-ink">Receita por dia</h2>
            <div className="mt-4">
              <LineChart
                labels={labels}
                series={[
                  {
                    key: 'revenue',
                    label: 'Receita',
                    color: 'var(--color-gold-400)',
                    values: filteredSeries.map((p) => p.revenueCents / 100),
                  },
                ]}
                formatValue={(v) => formatCurrencyBRL(v * 100)}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="font-display text-base font-bold text-ink">Participações por dia</h2>
              <div className="mt-4">
                <LineChart
                  labels={labels}
                  series={[
                    {
                      key: 'participations',
                      label: 'Participações',
                      color: 'var(--color-violet-400)',
                      values: filteredSeries.map((p) => p.participations),
                    },
                  ]}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="font-display text-base font-bold text-ink">Números vendidos</h2>
              <div className="mt-4">
                <LineChart
                  labels={labels}
                  series={[
                    {
                      key: 'tickets',
                      label: 'Números',
                      color: 'var(--color-emerald-400)',
                      values: filteredSeries.map((p) => p.ticketsSold),
                    },
                  ]}
                />
              </div>
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
                    values: filteredSeries.map((p) => p.ordersPaid),
                  },
                  {
                    key: 'pending',
                    label: 'Pendentes',
                    color: 'var(--color-ruby-400)',
                    values: filteredSeries.map((p) => p.ordersPending),
                  },
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-ink">Evolução da campanha</h2>
            <div className="mt-4">
              <LineChart
                labels={labels}
                series={[
                  {
                    key: 'revenue',
                    label: 'Receita (R$)',
                    color: 'var(--color-gold-400)',
                    values: filteredSeries.map((p) => p.revenueCents / 100),
                  },
                  {
                    key: 'tickets',
                    label: 'Números vendidos',
                    color: 'var(--color-emerald-400)',
                    values: filteredSeries.map((p) => p.ticketsSold),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink-faint">Campanha</h2>
              {status && <Badge tone={status.tone}>{status.label}</Badge>}
            </div>

            {campaign && (
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Nome" value={campaign.title} />
                <Row label="Data de início" value={formatDateLong(campaign.startDateISO)} />
                <Row label="Data de encerramento" value={formatDateLong(campaign.drawDateISO)} />
                <Row label="Total de números" value={campaign.totalNumbers.toLocaleString('pt-BR')} />
                <Row label="Números vendidos" value={(availability?.soldNumbers ?? 0).toLocaleString('pt-BR')} />
                <Row
                  label="Números disponíveis"
                  value={(
                    (availability?.totalNumbers ?? 0) -
                    (availability?.soldNumbers ?? 0) -
                    (availability?.reservedNumbers ?? 0)
                  ).toLocaleString('pt-BR')}
                />
                <Row label="Percentual vendido" value={`${soldPct}%`} />
              </div>
            )}

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                style={{ width: `${soldPct}%` }}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Link to="/admin/campaign">
                <Button variant="outline" className="w-full">
                  Editar campanha
                </Button>
              </Link>
              {campaign?.status === 'active' && (
                <Button
                  variant="ghost"
                  className="w-full"
                  icon={<Pause size={15} />}
                  iconPosition="left"
                  onClick={() => setPendingAction('pause')}
                >
                  Pausar campanha
                </Button>
              )}
              {campaign?.status === 'paused' && (
                <Button
                  variant="ghost"
                  className="w-full"
                  icon={<Play size={15} />}
                  iconPosition="left"
                  onClick={() => setPendingAction('resume')}
                >
                  Reativar campanha
                </Button>
              )}
              {campaign?.status !== 'finished' && (
                <Button
                  variant="danger"
                  className="w-full"
                  icon={<Square size={15} />}
                  iconPosition="left"
                  onClick={() => setPendingAction('finish')}
                >
                  Encerrar campanha
                </Button>
              )}
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 text-sm font-medium text-ink hover:border-gold-400/40"
          >
            Visualizar página pública
            <ExternalLink size={16} className="text-ink-faint" />
          </a>
        </div>
      </div>

      <ConfirmDialog
        open={pendingAction != null}
        title={
          pendingAction === 'pause'
            ? 'Pausar campanha?'
            : pendingAction === 'resume'
              ? 'Reativar campanha?'
              : 'Encerrar campanha?'
        }
        description={
          pendingAction === 'pause'
            ? 'A página pública vai mostrar "Campanha temporariamente pausada" até você reativar.'
            : pendingAction === 'resume'
              ? 'A campanha volta a aceitar novas participações imediatamente.'
              : 'Tem certeza que deseja encerrar esta campanha? A página pública passará a mostrar "Campanha encerrada".'
        }
        tone={pendingAction === 'finish' ? 'danger' : 'default'}
        confirmLabel={pendingAction === 'finish' ? 'Encerrar campanha' : 'Confirmar'}
        loading={actionLoading}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border-soft pb-2.5 last:border-0 last:pb-0">
      <span className="text-ink-faint">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
