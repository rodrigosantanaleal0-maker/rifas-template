import { useCountdown } from '../../hooks/useCountdown';
import { cn } from '../../lib/cn';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({
  targetISO,
  className,
  compact = false,
}: {
  targetISO?: string;
  className?: string;
  compact?: boolean;
}) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetISO);

  if (!targetISO || isPast) return null;

  const units = [
    { label: 'dias', value: days },
    { label: 'h', value: hours },
    { label: 'min', value: minutes },
    { label: 's', value: seconds },
  ];

  if (compact) {
    return (
      <span className={cn('tabular-nums font-display font-semibold text-ink', className)}>
        {days > 0 && `${days}d `}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)} role="timer" aria-live="off">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center rounded-xl border border-border bg-surface-2 px-3 py-2 min-w-[3.25rem]">
            <span className="font-display text-xl font-bold tabular-nums text-ink">{pad(u.value)}</span>
            <span className="text-[10px] uppercase tracking-wide text-ink-faint">{u.label}</span>
          </div>
          {i < units.length - 1 && <span className="text-ink-faint">:</span>}
        </div>
      ))}
    </div>
  );
}
