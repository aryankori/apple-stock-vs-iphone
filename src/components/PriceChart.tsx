import { useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Holding } from '../types';
import { CLOSE, DATES, LAST, TIMES, dayToTime } from '../lib/market';
import { linear, linePath, log } from '../lib/scale';
import { useWidth } from '../lib/hooks';
import { day, money2 } from '../lib/format';
import { ChartTooltip, DotKey, Legend, LineKey, Segmented } from './ui';

type Range = 'all' | '10y' | '5y' | '1y';
type ScaleKind = 'log' | 'linear';

const RANGE_YEARS: Record<Range, number | null> = { all: null, '10y': 10, '5y': 5, '1y': 1 };

interface Launch {
  index: number;
  date: string;
  models: Holding[];
}

interface Props {
  holdings: Holding[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const M = { top: 20, right: 64, bottom: 28, left: 8 };

function nearestIndex(t: number, lo: number, hi: number) {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (TIMES[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(TIMES[lo - 1] - t) < Math.abs(TIMES[lo] - t)) return lo - 1;
  return lo;
}

export function PriceChart({ holdings, selectedId, onSelect }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [range, setRange] = useState<Range>('all');
  const [scaleKind, setScaleKind] = useState<ScaleKind>('log');
  const [hover, setHover] = useState<number | null>(null);

  const height = width < 640 ? 300 : 420;
  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = height - M.top - M.bottom;

  const start = useMemo(() => {
    const years = RANGE_YEARS[range];
    if (!years) return 0;
    const cutoff = TIMES[LAST] - years * 365.25 * 86_400_000;
    return nearestIndex(cutoff, 0, LAST);
  }, [range]);

  const launches = useMemo(() => {
    const byIndex = new Map<number, Launch>();
    for (const h of holdings) {
      if (h.buyIndex < start) continue;
      const cur = byIndex.get(h.buyIndex);
      if (cur) cur.models.push(h);
      else byIndex.set(h.buyIndex, { index: h.buyIndex, date: h.releaseDate, models: [h] });
    }
    return [...byIndex.values()].sort((a, b) => a.index - b.index);
  }, [holdings, start]);

  const geom = useMemo(() => {
    if (innerW <= 0) return null;
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = start; i <= LAST; i++) {
      if (CLOSE[i] < lo) lo = CLOSE[i];
      if (CLOSE[i] > hi) hi = CLOSE[i];
    }
    const x = linear([TIMES[start], TIMES[LAST]], [0, innerW]);
    const y =
      scaleKind === 'log'
        ? log([lo * 0.85, hi * 1.12], [innerH, 0])
        : linear([0, hi * 1.08], [innerH, 0]);

    // Keep the path light: at most ~2 points per pixel.
    const stride = Math.max(1, Math.floor((LAST - start) / (innerW * 2)));
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = start; i <= LAST; i += stride) {
      xs.push(x(TIMES[i]));
      ys.push(y(CLOSE[i]));
    }
    if ((LAST - start) % stride !== 0) {
      xs.push(x(TIMES[LAST]));
      ys.push(y(CLOSE[LAST]));
    }
    const line = linePath(xs, ys);
    const area = `${line}L${xs[xs.length - 1].toFixed(1)},${innerH}L${xs[0].toFixed(1)},${innerH}Z`;

    // Year ticks, spaced at least ~64px apart.
    const firstYear = Number(DATES[start].slice(0, 4)) + 1;
    const lastYear = Number(DATES[LAST].slice(0, 4));
    const spanYears = Math.max(1, lastYear - firstYear + 1);
    const step = Math.max(1, Math.ceil(spanYears / Math.max(1, Math.floor(innerW / 64))));
    const xTicks: { t: number; label: string }[] = [];
    if (range === '1y') {
      for (let i = start; i <= LAST; i++) {
        if (DATES[i].slice(8) <= '07' && (i === 0 || DATES[i - 1].slice(5, 7) !== DATES[i].slice(5, 7))) {
          const mo = Number(DATES[i].slice(5, 7));
          if (mo % (innerW < 400 ? 3 : 2) === 1) {
            xTicks.push({
              t: dayToTime(DATES[i]),
              label: new Date(TIMES[i]).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
            });
          }
        }
      }
    } else {
      for (let yr = firstYear; yr <= lastYear; yr += step) {
        xTicks.push({ t: Date.UTC(yr, 0, 1), label: String(yr) });
      }
    }
    return { x, y, line, area, xTicks, yTicks: y.ticks(5) };
  }, [innerW, innerH, start, scaleKind, range]);

  const launchIndexSet = useMemo(() => new Set(launches.map((l) => l.index)), [launches]);
  const hoverLaunch = hover !== null && launchIndexSet.has(hover) ? launches.find((l) => l.index === hover) : undefined;

  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    if (!geom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Snap to a launch marker when the pointer is close to it.
    let best: Launch | null = null;
    let bestD = 16;
    for (const l of launches) {
      const d = Math.hypot(geom.x(TIMES[l.index]) - px, geom.y(CLOSE[l.index]) - py);
      if (d < bestD) {
        bestD = d;
        best = l;
      }
    }
    if (best) setHover(best.index);
    else setHover(nearestIndex(geom.x.invert(px), start, LAST));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!launches.length) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = launches.find((l) => l.index > (hover ?? -1)) ?? launches[launches.length - 1];
      setHover(next.index);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = [...launches].reverse().find((l) => l.index < (hover ?? Infinity)) ?? launches[0];
      setHover(prev.index);
    } else if (e.key === 'Enter' && hoverLaunch) {
      onSelect(hoverLaunch.models[0].id);
    } else if (e.key === 'Escape') {
      setHover(null);
    }
  };

  const selected = holdings.find((h) => h.id === selectedId);
  const hx = geom && hover !== null ? geom.x(TIMES[hover]) : 0;
  const hy = geom && hover !== null ? geom.y(CLOSE[hover]) : 0;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Legend
          items={[
            { key: <LineKey color="var(--stock)" />, label: 'AAPL daily close (split-adjusted)' },
            { key: <DotKey color="var(--cost)" />, label: 'iPhone launch day' },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <Segmented<Range>
            label="Time range"
            size="sm"
            value={range}
            onChange={(r) => {
              setRange(r);
              setHover(null);
            }}
            options={[
              { value: 'all', label: 'All' },
              { value: '10y', label: '10Y' },
              { value: '5y', label: '5Y' },
              { value: '1y', label: '1Y' },
            ]}
          />
          <Segmented<ScaleKind>
            label="Price scale"
            size="sm"
            value={scaleKind}
            onChange={setScaleKind}
            options={[
              { value: 'log', label: 'Log' },
              { value: 'linear', label: 'Linear' },
            ]}
          />
        </div>
      </div>

      <div
        ref={ref}
        className="relative mt-4 outline-none"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label="Chart of the AAPL share price since 2007 with iPhone launch days marked. Use the left and right arrow keys to step through launches and Enter to open one in the calculator."
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
      >
        {geom && (
          <svg width={width} height={height} className="block overflow-visible" aria-hidden="true">
            <g transform={`translate(${M.left},${M.top})`}>
              {geom.yTicks.map((t) => (
                <g key={t}>
                  <line className="grid-line" x1={0} x2={innerW} y1={geom.y(t)} y2={geom.y(t)} />
                  <text className="axis-text" x={innerW + 8} y={geom.y(t)} dy="0.32em">
                    ${t >= 1000 ? `${t / 1000}k` : t}
                  </text>
                </g>
              ))}
              <line className="base-line" x1={0} x2={innerW} y1={innerH} y2={innerH} />
              {geom.xTicks.map((t) => (
                <text key={t.t} className="axis-text" x={geom.x(t.t)} y={innerH + 18} textAnchor="middle">
                  {t.label}
                </text>
              ))}

              <path d={geom.area} fill="var(--stock-wash)" />
              <path
                d={geom.line}
                fill="none"
                stroke="var(--stock)"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {launches.map((l) => {
                const isSel = selected && l.models.some((m) => m.id === selected.id);
                return (
                  <circle
                    key={l.index}
                    cx={geom.x(TIMES[l.index])}
                    cy={geom.y(CLOSE[l.index])}
                    r={isSel ? 6.5 : 4.5}
                    fill="var(--cost)"
                    stroke={isSel ? 'var(--ink)' : 'var(--surface)'}
                    strokeWidth={2}
                  />
                );
              })}

              {/* End-of-line value label */}
              <circle cx={innerW} cy={geom.y(CLOSE[LAST])} r={4} fill="var(--stock)" stroke="var(--surface)" strokeWidth={2} />

              {hover !== null && (
                <g pointerEvents="none">
                  <line x1={hx} x2={hx} y1={0} y2={innerH} stroke="var(--axis)" strokeWidth={1} />
                  <circle
                    cx={hx}
                    cy={hy}
                    r={hoverLaunch ? 6.5 : 5}
                    fill={hoverLaunch ? 'var(--cost)' : 'var(--stock)'}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                </g>
              )}

              <rect
                width={innerW}
                height={innerH}
                fill="transparent"
                style={{ cursor: hoverLaunch ? 'pointer' : 'crosshair', touchAction: 'pan-y' }}
                onPointerMove={onPointerMove}
                onPointerDown={onPointerMove}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
                onClick={() => hoverLaunch && onSelect(hoverLaunch.models[0].id)}
              />
            </g>
          </svg>
        )}

        {geom && hover !== null && (
          <ChartTooltip x={hx + M.left} y={Math.min(hy + M.top - 20, height - 150)} width={width}>
            <p className="text-xs text-muted">{day(DATES[hover])}</p>
            <p className="mt-0.5 flex items-center gap-2">
              <LineKey color="var(--stock)" />
              <span className="font-semibold text-ink">{money2(CLOSE[hover])}</span>
              <span className="text-muted">AAPL close</span>
            </p>
            {hoverLaunch && (
              <div className="mt-2 border-t border-line pt-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
                  <DotKey color="var(--cost)" />
                  Launched this day
                </p>
                <ul className="mt-1 space-y-0.5">
                  {hoverLaunch.models.map((m) => (
                    <li key={m.id} className="flex justify-between gap-3 text-ink">
                      <span>{m.model}</span>
                      <span className="num text-ink-2">${m.msrp}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-xs text-accent">Click to open in the calculator</p>
              </div>
            )}
          </ChartTooltip>
        )}
      </div>

      {geom && (
        <p className="mt-3 text-sm text-ink-2">
          <span className="font-semibold text-ink">{money2(CLOSE[start])}</span> on {day(DATES[start])}
          {' → '}
          <span className="font-semibold text-ink">{money2(CLOSE[LAST])}</span> on {day(DATES[LAST])}
          <span className="text-muted"> · {(CLOSE[LAST] / CLOSE[start]).toFixed(1)}× in this window</span>
        </p>
      )}
    </div>
  );
}
