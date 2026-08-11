import { useRef, useState, type MouseEvent } from 'react';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  labels: string[];
  series: ChartSeries[];
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

export function LineChart({ labels, series, formatValue = String, height = 220 }: LineChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;
  const n = labels.length;
  const maxValue = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));

  const xAt = (i: number) => PADDING.left + (n <= 1 ? 0 : (i / (n - 1)) * innerWidth);
  const yAt = (v: number) => PADDING.top + innerHeight - (v / maxValue) * innerHeight;

  const pathFor = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(v)}`).join(' ');

  function handleMove(e: MouseEvent<SVGSVGElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (n - 1));
    setHoverIndex(Math.min(n - 1, Math.max(0, idx)));
  }

  // dedupe: valores pequenos de maxValue podem arredondar para o mesmo tick,
  // o que geraria linhas de grade e keys de React duplicadas.
  const yTicks = Array.from(new Set([0, 0.5, 1].map((f) => Math.round(maxValue * f))));

  if (n === 0) return null;

  return (
    <div ref={wrapperRef} className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full overflow-visible"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Gráfico de linha"
      >
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

        {series.map((s) => (
          <path
            key={`area-${s.key}`}
            d={`${pathFor(s.values)} L ${xAt(n - 1)} ${yAt(0)} L ${xAt(0)} ${yAt(0)} Z`}
            fill={s.color}
            opacity={0.1}
            stroke="none"
          />
        ))}
        {series.map((s) => (
          <path
            key={`line-${s.key}`}
            d={pathFor(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {series.map((s) => (
          <circle
            key={`end-${s.key}`}
            cx={xAt(n - 1)}
            cy={yAt(s.values[n - 1])}
            r={4}
            fill={s.color}
            stroke="var(--color-surface)"
            strokeWidth={2}
          />
        ))}

        {hoverIndex != null && (
          <line
            x1={xAt(hoverIndex)}
            x2={xAt(hoverIndex)}
            y1={PADDING.top}
            y2={height - PADDING.bottom}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        )}
        {hoverIndex != null &&
          series.map((s) => (
            <circle
              key={`hover-${s.key}`}
              cx={xAt(hoverIndex)}
              cy={yAt(s.values[hoverIndex])}
              r={4}
              fill={s.color}
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          ))}
      </svg>

      {hoverIndex != null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-max -translate-x-1/2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(xAt(hoverIndex) / WIDTH) * 100}%` }}
        >
          <p className="mb-1 font-semibold text-ink">{labels[hoverIndex]}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-1.5 text-ink-muted">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-ink">{formatValue(s.values[hoverIndex])}</span> {s.label}
            </p>
          ))}
        </div>
      )}

      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
