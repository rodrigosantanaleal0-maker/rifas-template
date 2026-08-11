import { campaignStore } from '../lib/campaignStore';
import { mockTimeSeries } from '../mocks/admin/analytics';
import { mockParticipants } from '../mocks/admin/participants';
import type { AnalyticsPeriod, DashboardMetrics, TimeSeriesPoint } from '../types/admin';

/** GET /api/admin/dashboard · GET /api/admin/analytics */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const PERIOD_DAYS: Record<AnalyticsPeriod, number | null> = {
  today: 1,
  '7d': 7,
  '30d': 30,
  all: null,
};

export function filterSeriesByPeriod(series: TimeSeriesPoint[], period: AnalyticsPeriod): TimeSeriesPoint[] {
  const days = PERIOD_DAYS[period];
  if (days == null) return series;
  return series.slice(-days);
}

function sum(series: TimeSeriesPoint[], key: keyof TimeSeriesPoint): number {
  return series.reduce((acc, point) => acc + (typeof point[key] === 'number' ? (point[key] as number) : 0), 0);
}

function pctDelta(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export async function getTimeSeries(): Promise<TimeSeriesPoint[]> {
  if (USE_MOCKS) return delay(mockTimeSeries, 250);
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics`);
  if (!res.ok) throw new Error('Falha ao carregar analytics.');
  return res.json();
}

export async function getDashboardMetrics(period: AnalyticsPeriod): Promise<DashboardMetrics> {
  const series = await getTimeSeries();
  const current = filterSeriesByPeriod(series, period);
  const days = current.length;
  const previous =
    period === 'all' ? [] : series.slice(Math.max(0, series.length - days * 2), series.length - days);

  const { availability } = campaignStore.getState();

  return {
    revenueCents: sum(current, 'revenueCents'),
    revenueDeltaPct: previous.length ? pctDelta(sum(current, 'revenueCents'), sum(previous, 'revenueCents')) : null,
    participations: sum(current, 'participations'),
    participationsDeltaPct: previous.length
      ? pctDelta(sum(current, 'participations'), sum(previous, 'participations'))
      : null,
    ticketsSoldPct: availability.totalNumbers > 0 ? (availability.soldNumbers / availability.totalNumbers) * 100 : 0,
    // Escopados ao mesmo período do restante das métricas — nunca misturar
    // um total histórico com um número já filtrado por período.
    ordersPaid: sum(current, 'ordersPaid'),
    ordersPending: sum(current, 'ordersPending'),
    participantsCount: mockParticipants.length,
  };
}
