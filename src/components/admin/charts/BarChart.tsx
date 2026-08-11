import { useState } from 'react';

export interface BarSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

interface BarChartProps {
  labels: string[];
  series: BarSeries[];
  formatValue?: (value: number) => string;
  height?: number;
}

const WIDTH = 640;
const PADDING = { top: 16, right: 12, bottom: 28, left: 46 };

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(value)) - 1);
  return Math.ceil(value / magnitude) * magnitude;
}

export function BarChart({ labels, series, formatValue = String, height = 220 }: BarChartProps) {
  const [hover, setHover] = useState<{ groupIndex: number; seriesKey: string } | null>(null);

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;
  const n = labels.length;
  const roundedMax = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));

  const groupWidth = n > 0 ? innerWidth / n : innerWidth;
  const barGap = 3;
  const barWidth = Math.max(2, Math.min(24, (groupWidth - barGap * (series.length + 1)) / series.length));

  const yAt = (v: number) => PADDING.top + innerHeight - (v / roundedMax) * innerHeight;
  // dedupe: valores pequenos de roundedMax podem arredondar para o mesmo
  // tick, o que geraria linhas de grade e keys de React duplicadas.
  const yTicks = Array.from(new Set([0, 0.5, 1].map((f) => Math.round(roundedMax * f))));

  if (n === 0) return null;

  return (
    <div className="relative w-full select-none">
      <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full overflow-visible" role="img" aria-label="Gráfico de barras">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yAt(tick)}
              y2={yAt(tick)}
              stroke="var(--color-border-soft)"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={yAt(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-current text-[9px] text-ink-faint"
            >
              {formatValue(tick)}
            </text>
          </g>
        ))}

        {labels.map((label, gi) => {
          const groupX = PADDING.left + gi * groupWidth;
          const totalBarsWidth = barWidth * series.length + barGap * (series.length - 1);
          const startX = groupX + (groupWidth - totalBarsWidth) / 2;
          return (
            <g key={label}>
              {series.map((s, si) => {
                const value = s.values[gi] ?? 0;
                const x = startX + si * (barWidth + barGap);
                const y = yAt(value);
                const barHeight = Math.max(0, PADDING.top + innerHeight - y);
                const isHover = hover?.groupIndex === gi && hover.seriesKey === s.key;
                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    fill={s.color}
                    opacity={isHover ? 1 : 0.85}
                    onMouseEnter={() => setHover({ groupIndex: gi, seriesKey: s.key })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
              <text
                x={groupX + groupWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className="fill-current text-[9px] text-ink-faint"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover &&
        (() => {
          const s = series.find((se) => se.key === hover.seriesKey);
          if (!s) return null;
          return (
            <div className="pointer-events-none absolute left-1/2 top-2 z-10 min-w-max -translate-x-1/2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg">
              <p className="flex items-center gap-1.5 text-ink-muted">
                <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="font-medium text-ink">{formatValue(s.values[hover.groupIndex] ?? 0)}</span> {s.label} ·{' '}
                {labels[hover.groupIndex]}
              </p>
            </div>
          );
        })()}

      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
