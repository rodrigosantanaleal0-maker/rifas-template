import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  deltaPct?: number | null;
  loading?: boolean;
}

export function StatCard({ label, value, icon, deltaPct, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-3" />
        <div className="mt-4 h-7 w-32 animate-pulse rounded bg-surface-3" />
      </div>
    );
  }

  const positive = (deltaPct ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border/80">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-gold-400">{icon}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-ink">{value}</p>
      {deltaPct != null && (
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-xs font-semibold',
            positive ? 'text-emerald-400' : 'text-ruby-400',
          )}
        >
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {positive ? '+' : ''}
          {deltaPct.toFixed(1)}% este período
        </p>
      )}
    </div>
  );
}
