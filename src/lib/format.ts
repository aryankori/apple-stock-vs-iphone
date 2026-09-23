const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const usd2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const money = (v: number) => usd0.format(v);
export const money2 = (v: number) => usd2.format(v);
export const moneyCompact = (v: number) => (Math.abs(v) < 10_000 ? usd0.format(v) : usdCompact.format(v));
export const shares = (v: number) => num.format(v);
export const multiple = (v: number) => `${v >= 10 ? v.toFixed(0) : v.toFixed(1)}×`;
export const pct = (v: number, digits = 1) =>
  `${v > 0 ? '+' : ''}${(v * 100).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
export const signedMoney = (v: number) => `${v >= 0 ? '+' : '−'}${usd0.format(Math.abs(v))}`;
export const day = (d: string) => dateFmt.format(new Date(`${d}T00:00:00Z`));
export const month = (d: string) => monthFmt.format(new Date(`${d}T00:00:00Z`));
