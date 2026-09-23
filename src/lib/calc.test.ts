import { describe, expect, it } from 'vitest';
import { IPHONES } from '../data/iphones';
import { evaluate, evaluateAll, invest, presets, summarize, timeline } from './calc';
import { CLOSE, DATES, LAST, indexOnOrBefore } from './market';

describe('iPhone dataset', () => {
  it('has unique ids and is in release order', () => {
    expect(new Set(IPHONES.map((p) => p.id)).size).toBe(IPHONES.length);
    const dates = IPHONES.map((p) => p.releaseDate);
    expect([...dates].sort()).toEqual(dates);
  });
});

describe('price history', () => {
  it('finds the last trading day on or before a date', () => {
    // 2013-09-21 was a Saturday; the Friday close applies.
    expect(DATES[indexOnOrBefore('2013-09-21')]).toBe('2013-09-20');
    expect(DATES[indexOnOrBefore('2007-06-29')]).toBe('2007-06-29');
    expect(indexOnOrBefore('2999-01-01')).toBe(LAST);
  });
});

describe('calculations', () => {
  it('matches the spreadsheet formulas on a price basis', () => {
    const phone = IPHONES[0];
    const h = evaluate(phone, 'price');
    const shares = phone.msrp / CLOSE[h.buyIndex];
    expect(h.sharesBought).toBeCloseTo(shares, 10);
    expect(h.value).toBeCloseTo(shares * CLOSE[LAST], 6);
    expect(h.gain).toBeCloseTo(h.value - phone.msrp, 6);
    expect(h.multiple).toBeCloseTo(h.value / phone.msrp, 10);
  });

  it('is worth more with dividends reinvested for phones held across dividends', () => {
    const p = invest(1000, '2013-01-02', 'price');
    const t = invest(1000, '2013-01-02', 'total');
    expect(t.value).toBeGreaterThan(p.value);
    expect(t.sharesNow).toBeGreaterThan(p.sharesNow);
  });

  it('summarizes a basket', () => {
    const all = evaluateAll(IPHONES, 'price');
    const s = summarize(all);
    expect(s.count).toBe(IPHONES.length);
    expect(s.spent).toBe(IPHONES.reduce((sum, p) => sum + p.msrp, 0));
    expect(s.value).toBeCloseTo(all.reduce((sum, h) => sum + h.value, 0), 6);
  });

  it('builds a timeline that ends at the summary value', () => {
    const picks = evaluateAll(IPHONES.slice(0, 5), 'total');
    const points = timeline(picks, 'total');
    const last = points[points.length - 1];
    expect(last.spent).toBe(summarize(picks).spent);
    expect(last.value).toBeCloseTo(summarize(picks).value, 4);
    expect(points[0].value).toBeCloseTo(picks[0].msrp, 4);
  });

  it('builds presets from real ids, one phone per year', () => {
    for (const p of presets(IPHONES)) {
      for (const id of p.ids) expect(IPHONES.some((x) => x.id === id)).toBe(true);
    }
    const top = presets(IPHONES).find((p) => p.id === 'top')!;
    const years = top.ids.map((id) => IPHONES.find((x) => x.id === id)!.releaseDate.slice(0, 4));
    expect(new Set(years).size).toBe(years.length);
  });
});
