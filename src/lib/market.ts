import snapshot from '../data/aapl.json';
import type { Basis, MarketSnapshot } from '../types';

export const MARKET = snapshot as MarketSnapshot;
export const { dates: DATES, close: CLOSE, adjClose: ADJ_CLOSE } = MARKET.history;
export const LAST = DATES.length - 1;
export const PRICE_NOW = CLOSE[LAST];
export const TODAY = DATES[LAST];

export function seriesFor(basis: Basis): number[] {
  return basis === 'total' ? ADJ_CLOSE : CLOSE;
}

/** Index of the last trading day on or before `date` (YYYY-MM-DD). */
export function indexOnOrBefore(date: string): number {
  let lo = 0;
  let hi = LAST;
  if (date < DATES[0]) return 0;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (DATES[mid] <= date) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Milliseconds since epoch for a YYYY-MM-DD string, at UTC midnight. */
export function dayToTime(day: string): number {
  return Date.parse(`${day}T00:00:00Z`);
}

export const TIMES: number[] = DATES.map(dayToTime);
