import { useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { TimelinePoint } from '../lib/calc';
import { DATES, TIMES } from '../lib/market';
import { linear, linePath, niceMax, stepPath } from '../lib/scale';
import { useWidth } from '../lib/hooks';
import { day, money, moneyCompact } from '../lib/format';
import { ChartTooltip, LineKey } from './ui';

interface Props {
  points: TimelinePoint[];
  height: number;
  /** Accessible description of what the chart shows. */
  label: string;
  compact?: boolean;
}

/**
 * Value of the AAPL position over time (blue line with a wash) next to the
 * running total spent on iPhones (orange step line), on one dollar axis.
 */
export function GrowthChart({ points, height, label, compact }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const M = compact
    ? { top: 12, right: 8, bottom: 22, left: 40 }
    : { top: 16, right: 12, bottom: 28, left: 52 };
  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = height - M.top - M.bottom;

  const geom = useMemo(() => {
    if (innerW <= 0 || points.length < 2) return null;
    const t0 = TIMES[points[0].i];
    const t1 = TIMES[points[points.length - 1].i];
    const max = points.reduce((m, p) => Math.max(m, p.value, p.spent), 0);
    const x = linear([t0, t1], [0, innerW]);
    const y = linear([0, niceMax(max * 1.04, 4)], [innerH, 0]);

    const stride = Math.max(1, Math.floor(points.length / (innerW * 2)));
    const xs: number[] = [];
    const vs: number[] = [];
    for (let k = 0; k < points.length; k += stride) {
      xs.push(x(TIMES[points[k].i]));
      vs.push(y(points[k].value));
    }
    const lastP = points[points.length - 1];
    if ((points.length - 1) % stride !== 0) {
      xs.push(x(TIMES[lastP.i]));
      vs.push(y(lastP.value));
    }
    const valueLine = linePath(xs, vs);
    const area = `${valueLine}L${xs[xs.length - 1].toFixed(1)},${innerH}L${xs[0].toFixed(1)},${innerH}Z`;

    // The spent line only changes on purchase days; draw it as a step.
    const sx: number[] = [];
    const sy: number[] = [];
    points.forEach((p, k) => {
      if (k === 0 || p.spent !== points[k - 1].spent) {
        sx.push(x(TIMES[p.i]));
        sy.push(y(p.spent));
      }
    });
    sx.push(x(TIMES[lastP.i]));
    sy.push(y(lastP.spent));

    const years = (t1 - t0) / (365.25 * 86_400_000);
    const minGap = compact ? 44 : 60;
    const step = Math.max(1, Math.ceil(years / Math.max(1, Math.floor(innerW / minGap))));
    const y0 = new Date(t0).getUTCFullYear() + 1;
    const y1 = new Date(t1).getUTCFullYear();
    const xTicks: number[] = [];
    for (let yr = y0; yr <= y1; yr += step) xTicks.push(yr);
    if (years < 2) xTicks.length = 0;

    return { x, y, area, valueLine, spentLine: stepPath(sx, sy), xTicks, yTicks: y.ticks(4) };
  }, [points, innerW, innerH, compact]);

  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    if (!geom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = geom.x.invert(e.clientX - rect.left);
    let lo = 0;
    let hi = points.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (TIMES[points[mid].i] < t) lo = mid + 1;
      else hi = mid;
    }
    setHover(lo);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!points.length) return;
    const jump = Math.max(1, Math.round(points.length / 40));
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover((h) => Math.min(points.length - 1, (h ?? -1) + jump));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover((h) => Math.max(0, (h ?? points.length) - jump));
    } else if (e.key === 'Escape') {
      setHover(null);
    }
  };

  const hp = hover !== null ? points[hover] : null;
  const hx = geom && hp ? geom.x(TIMES[hp.i]) : 0;
  const last = points[points.length - 1];

  return (
    <div
      ref={ref}
      className="relative outline-none"
      style={{ height }}
      tabIndex={0}
      role="group"
      aria-label={`${label} Use the arrow keys to read values.`}
      onKeyDown={onKeyDown}
      onBlur={() => setHover(null)}
    >
      {geom && (
        <svg width={width} height={height} className="block overflow-visible" aria-hidden="true">
          <g transform={`translate(${M.left},${M.top})`}>
            {geom.yTicks.map((t) => (
              <g key={t}>
                <line className="grid-line" x1={0} x2={innerW} y1={geom.y(t)} y2={geom.y(t)} />
                <text className="axis-text" x={-8} y={geom.y(t)} dy="0.32em" textAnchor="end">
                  {moneyCompact(t)}
                </text>
              </g>
            ))}
            <line className="base-line" x1={0} x2={innerW} y1={innerH} y2={innerH} />
            {geom.xTicks.map((yr) => (
              <text key={yr} className="axis-text" x={geom.x(Date.UTC(yr, 0, 1))} y={innerH + 17} textAnchor="middle">
                {compact ? `'${String(yr).slice(2)}` : yr}
              </text>
            ))}

            <path d={geom.area} fill="var(--stock-wash)" />
            <path d={geom.spentLine} fill="none" stroke="var(--cost)" strokeWidth={2} strokeLinejoin="round" />
            <path
              d={geom.valueLine}
              fill="none"
              stroke="var(--stock)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle
              cx={innerW}
              cy={geom.y(last.value)}
              r={4}
              fill="var(--stock)"
              stroke="var(--surface)"
              strokeWidth={2}
            />

            {hp && (
              <g pointerEvents="none">
                <line x1={hx} x2={hx} y1={0} y2={innerH} stroke="var(--axis)" strokeWidth={1} />
                <circle cx={hx} cy={geom.y(hp.spent)} r={4} fill="var(--cost)" stroke="var(--surface)" strokeWidth={2} />
                <circle cx={hx} cy={geom.y(hp.value)} r={5} fill="var(--stock)" stroke="var(--surface)" strokeWidth={2} />
              </g>
            )}

            <rect
              width={innerW}
              height={innerH}
              fill="transparent"
              style={{ cursor: 'crosshair', touchAction: 'pan-y' }}
              onPointerMove={onPointerMove}
              onPointerDown={onPointerMove}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
            />
          </g>
        </svg>
      )}

      {geom && hp && (
        <ChartTooltip x={hx + M.left} y={M.top} width={width}>
          <p className="text-xs text-muted">{day(DATES[hp.i])}</p>
          <p className="mt-1 flex items-center gap-2">
            <LineKey color="var(--stock)" />
            <span className="font-semibold text-ink">{money(hp.value)}</span>
            <span className="text-muted">in AAPL</span>
          </p>
          <p className="mt-0.5 flex items-center gap-2">
            <LineKey color="var(--cost)" />
            <span className="font-semibold text-ink">{money(hp.spent)}</span>
            <span className="text-muted">on iPhones</span>
          </p>
        </ChartTooltip>
      )}
    </div>
  );
}
