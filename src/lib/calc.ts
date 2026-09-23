import type { Basis, Holding, IPhone } from '../types';
import { CLOSE, DATES, LAST, dayToTime, indexOnOrBefore, seriesFor } from './market';

const YEAR_MS = 365.25 * 86_400_000;

/**
 * Value today of putting `amount` dollars into AAPL on `date`.
 *
 * Price basis: shares = amount / close[buy], value = shares * close[today].
 * Total basis: the same, but each dividend buys more shares, which is the
 * ratio of the dividend-adjusted closes.
 */
export function invest(amount: number, date: string, basis: Basis) {
  const buyIndex = indexOnOrBefore(date);
  const series = seriesFor(basis);
  const growth = series[LAST] / series[buyIndex];
  const value = amount * growth;
  const buyPrice = CLOSE[buyIndex];
  const years = (dayToTime(DATES[LAST]) - dayToTime(DATES[buyIndex])) / YEAR_MS;
  return {
    buyIndex,
    buyDate: DATES[buyIndex],
    buyPrice,
    sharesBought: amount / buyPrice,
    sharesNow: value / CLOSE[LAST],
    value,
    gain: value - amount,
    multiple: growth,
    years,
    cagr: years >= 1 ? growth ** (1 / years) - 1 : null,
  };
}

export function evaluate(phone: IPhone, basis: Basis): Holding {
  return { ...phone, ...invest(phone.msrp, phone.releaseDate, basis) };
}

export function evaluateAll(phones: IPhone[], basis: Basis): Holding[] {
  return phones.map((p) => evaluate(p, basis));
}

export interface Summary {
  count: number;
  spent: number;
  value: number;
  gain: number;
  multiple: number;
}

export function summarize(holdings: Holding[]): Summary {
  const spent = holdings.reduce((s, h) => s + h.msrp, 0);
  const value = holdings.reduce((s, h) => s + h.value, 0);
  return {
    count: holdings.length,
    spent,
    value,
    gain: value - spent,
    multiple: spent > 0 ? value / spent : 0,
  };
}

export interface TimelinePoint {
  i: number;
  value: number;
  spent: number;
}

/**
 * Daily value of a basket of iPhone-priced AAPL purchases, next to the
 * running total spent on the phones. Starts on the first purchase day.
 */
export function timeline(holdings: Holding[], basis: Basis): TimelinePoint[] {
  if (!holdings.length) return [];
  const series = seriesFor(basis);
  const buys = [...holdings].sort((a, b) => a.buyIndex - b.buyIndex);
  const out: TimelinePoint[] = [];
  let units = 0;
  let spent = 0;
  let j = 0;
  for (let i = buys[0].buyIndex; i <= LAST; i++) {
    while (j < buys.length && buys[j].buyIndex <= i) {
      units += buys[j].msrp / series[buys[j].buyIndex];
      spent += buys[j].msrp;
      j++;
    }
    out.push({ i, value: units * series[i], spent });
  }
  return out;
}

const yearOf = (p: IPhone) => p.releaseDate.slice(0, 4);

function pickPerYear(phones: IPhone[], better: (a: IPhone, b: IPhone) => boolean): string[] {
  const best = new Map<string, IPhone>();
  for (const p of phones) {
    const cur = best.get(yearOf(p));
    if (!cur || better(p, cur)) best.set(yearOf(p), p);
  }
  return [...best.values()].map((p) => p.id);
}

/** Preset iPhone histories for the "your iPhones" builder. */
export function presets(phones: IPhone[]) {
  const top = pickPerYear(phones, (a, b) => a.msrp > b.msrp);
  const cheapest = pickPerYear(phones, (a, b) => a.msrp < b.msrp);
  const everyOther = cheapest.filter((_, i) => i % 2 === 0);
  return [
    { id: 'top', label: 'Top model every year', ids: top },
    { id: 'cheapest', label: 'Cheapest model every year', ids: cheapest },
    { id: 'every-other', label: 'Cheapest, every other year', ids: everyOther },
    { id: 'all', label: `All ${phones.length}`, ids: phones.map((p) => p.id) },
  ];
}
