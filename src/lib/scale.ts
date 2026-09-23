export interface Scale {
  (v: number): number;
  invert: (px: number) => number;
  ticks: (count?: number) => number[];
}

export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const s = ((v: number) => r0 + (v - d0) * k) as Scale;
  s.invert = (px) => (k === 0 ? d0 : d0 + (px - r0) / k);
  s.ticks = (count = 5) => niceTicks(d0, d1, count);
  return s;
}

export function log([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  const k = (r1 - r0) / (l1 - l0);
  const s = ((v: number) => r0 + (Math.log10(v) - l0) * k) as Scale;
  s.invert = (px) => 10 ** (l0 + (px - r0) / k);
  s.ticks = () => {
    const out: number[] = [];
    for (let e = Math.floor(l0); e <= Math.ceil(l1); e++) {
      for (const m of [1, 2, 5]) {
        const v = m * 10 ** e;
        if (v >= d0 * 0.999 && v <= d1 * 1.001) out.push(v);
      }
    }
    return out;
  };
  return s;
}

function niceStep(span: number, count: number) {
  const raw = span / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1;
  return step * mag;
}

export function niceTicks(d0: number, d1: number, count = 5): number[] {
  if (d1 <= d0) return [d0];
  const step = niceStep(d1 - d0, count);
  const start = Math.ceil(d0 / step) * step;
  const out: number[] = [];
  for (let v = start; v <= d1 + step * 1e-9; v += step) out.push(Number(v.toPrecision(12)));
  return out;
}

/** A domain maximum rounded up to the next nice tick. */
export function niceMax(max: number, count = 5): number {
  if (max <= 0) return 1;
  const step = niceStep(max, count);
  return Math.ceil(max / step) * step;
}

/** SVG path for a polyline through the given points. */
export function linePath(xs: number[], ys: number[]): string {
  let d = '';
  for (let i = 0; i < xs.length; i++) {
    d += `${i ? 'L' : 'M'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`;
  }
  return d;
}

/** SVG path for a horizontal-then-vertical step line (value changes at each x). */
export function stepPath(xs: number[], ys: number[]): string {
  let d = '';
  for (let i = 0; i < xs.length; i++) {
    if (i === 0) d += `M${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;
    else d += `H${xs[i].toFixed(1)}V${ys[i].toFixed(1)}`;
  }
  return d;
}

/** Bar with a 4px rounded top and a square base, from baseline `y0` up to `y`. */
export function columnPath(x: number, w: number, y: number, y0: number, r = 4): string {
  const h = y0 - y;
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return (
    `M${x},${y0}V${y + rr}` +
    `Q${x},${y} ${x + rr},${y}` +
    `H${x + w - rr}` +
    `Q${x + w},${y} ${x + w},${y + rr}` +
    `V${y0}Z`
  );
}
