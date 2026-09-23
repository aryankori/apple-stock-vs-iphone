import { useMemo, useState, type KeyboardEvent } from 'react';
import type { Holding } from '../types';
import { columnPath, linear, niceMax } from '../lib/scale';
import { useWidth } from '../lib/hooks';
import { day, money, moneyCompact, multiple } from '../lib/format';
import { ChartTooltip, Segmented } from './ui';

type Metric = 'multiple' | 'value';

interface Props {
  holdings: Holding[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const M = { top: 28, right: 8, bottom: 28, left: 44 };

/** One column per iPhone in release order: what its launch price is worth in AAPL today. */
export function RankingChart({ holdings, selectedId, onSelect }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [metric, setMetric] = useState<Metric>('multiple');
  const [hover, setHover] = useState<number | null>(null);

  const height = width < 640 ? 280 : 360;
  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = height - M.top - M.bottom;
  const n = holdings.length;
  const valueOf = (h: Holding) => (metric === 'multiple' ? h.multiple : h.value);
  const fmt = metric === 'multiple' ? multiple : moneyCompact;

  const geom = useMemo(() => {
    if (innerW <= 0) return null;
    const max = holdings.reduce((m, h) => Math.max(m, metric === 'multiple' ? h.multiple : h.value), 0);
    const y = linear([0, niceMax(max, 5)], [innerH, 0]);
    const band = innerW / n;
    const barW = Math.max(2, Math.min(24, band - 2));
    const pad = (band - barW) / 2;

    // One year label per release year, skipped when labels would collide.
    const yearTicks: { x: number; label: string }[] = [];
    let lastX = -Infinity;
    holdings.forEach((h, i) => {
      const yr = h.releaseDate.slice(0, 4);
      if (i > 0 && holdings[i - 1].releaseDate.slice(0, 4) === yr) return;
      const x = i * band + band / 2;
      if (x - lastX < (innerW < 500 ? 34 : 40)) return;
      yearTicks.push({ x, label: innerW < 500 ? `'${yr.slice(2)}` : yr });
      lastX = x;
    });

    return { y, band, barW, pad, yearTicks, yTicks: y.ticks(5) };
  }, [holdings, metric, innerW, innerH, n]);

  const selectedIndex = holdings.findIndex((h) => h.id === selectedId);
  const topIndex = holdings.reduce((best, h, i) => (valueOf(h) > valueOf(holdings[best]) ? i : best), 0);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = hover ?? selectedIndex;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover(Math.min(n - 1, cur + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover(Math.max(0, cur - 1));
    } else if (e.key === 'Enter' && hover !== null) {
      onSelect(holdings[hover].id);
    } else if (e.key === 'Escape') {
      setHover(null);
    }
  };

  const labelFor = (i: number) => {
    if (!geom) return null;
    const h = holdings[i];
    const x = i * geom.band + geom.band / 2;
    const y = geom.y(valueOf(h)) - 8;
    const anchor = x < 60 ? 'start' : x > innerW - 60 ? 'end' : 'middle';
    return (
      <text
        x={anchor === 'start' ? x - geom.barW / 2 : anchor === 'end' ? x + geom.barW / 2 : x}
        y={y}
        textAnchor={anchor}
        className="fill-ink text-[12px] font-semibold"
      >
        {h.model} · {fmt(valueOf(h))}
      </text>
    );
  };

  const hh = hover !== null ? holdings[hover] : null;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-2">
          {metric === 'multiple'
            ? 'How many times over each launch price has grown in AAPL'
            : 'What each launch price is worth in AAPL today'}
        </p>
        <Segmented<Metric>
          label="Measure"
          size="sm"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'multiple', label: 'Multiple' },
            { value: 'value', label: 'Value today' },
          ]}
        />
      </div>

      <div
        ref={ref}
        className="relative mt-4 outline-none"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label="Column chart of every iPhone in release order. Use the arrow keys to move between phones and Enter to open one in the calculator."
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
      >
        {geom && (
          <svg width={width} height={height} className="block overflow-visible" aria-hidden="true">
            <g transform={`translate(${M.left},${M.top})`}>
              {geom.yTicks.map((t) => (
                <g key={t}>
                  <line className="grid-line" x1={0} x2={innerW} y1={geom.y(t)} y2={geom.y(t)} />
                  <text className="axis-text" x={-8} y={geom.y(t)} dy="0.32em" textAnchor="end">
                    {metric === 'multiple' ? `${t}×` : moneyCompact(t)}
                  </text>
                </g>
              ))}

              {holdings.map((h, i) => {
                const x = i * geom.band + geom.pad;
                const y = geom.y(valueOf(h));
                const isSel = i === selectedIndex;
                return (
                  <path
                    key={h.id}
                    d={columnPath(x, geom.barW, Math.min(y, innerH - 1), innerH, Math.min(4, geom.barW / 2))}
                    fill={isSel ? 'var(--ink)' : 'var(--stock)'}
                    opacity={hover !== null && hover !== i ? 0.55 : 1}
                    style={{ transition: 'opacity 150ms' }}
                  />
                );
              })}

              <line className="base-line" x1={0} x2={innerW} y1={innerH} y2={innerH} />
              {geom.yearTicks.map((t) => (
                <text key={t.label} className="axis-text" x={t.x} y={innerH + 18} textAnchor="middle">
                  {t.label}
                </text>
              ))}

              {topIndex !== selectedIndex &&
                Math.abs(topIndex - selectedIndex) * geom.band > 180 &&
                labelFor(topIndex)}
              {selectedIndex >= 0 && labelFor(selectedIndex)}

              {holdings.map((h, i) => (
                <rect
                  key={h.id}
                  x={i * geom.band}
                  y={0}
                  width={geom.band}
                  height={innerH}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={() => setHover(i)}
                  onPointerDown={() => setHover(i)}
                  onClick={() => onSelect(h.id)}
                />
              ))}
            </g>
          </svg>
        )}

        {geom && hh && hover !== null && (
          <ChartTooltip
            x={M.left + hover * geom.band + geom.band / 2}
            y={Math.max(0, Math.min(geom.y(valueOf(hh)) + M.top - 30, height - 130))}
            width={width}
          >
            <p className="font-semibold text-ink">{hh.model}</p>
            <p className="text-xs text-muted">
              {day(hh.releaseDate)} · ${hh.msrp}
            </p>
            <p className="mt-1.5 flex justify-between gap-3">
              <span className="text-ink-2">Worth today</span>
              <span className="num font-semibold text-ink">{money(hh.value)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-ink-2">Multiple</span>
              <span className="num font-semibold text-ink">{multiple(hh.multiple)}</span>
            </p>
          </ChartTooltip>
        )}
      </div>
    </div>
  );
}
