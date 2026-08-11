import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'gold' | 'violet' | 'emerald' | 'ruby' | 'neutral';

const toneClasses: Record<Tone, string> = {
  gold: 'bg-gold-500/10 text-gold-300 border-gold-500/30',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  ruby: 'bg-ruby-500/10 text-ruby-400 border-ruby-500/30',
  neutral: 'bg-surface-2 text-ink-muted border-border',
};

export function Badge({
  children,
  tone = 'gold',
  icon,
  pulse,
  className,
}: PropsWithChildren<{ tone?: Tone; icon?: ReactNode; pulse?: boolean; className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide',
        toneClasses[tone],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
