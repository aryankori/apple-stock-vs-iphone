#!/usr/bin/env node
/**
 * Fetch the AAPL daily price history from Yahoo Finance and write it to
 * src/data/aapl.json. The web app bundles this file at build time.
 *
 * The script runs in CI before each deploy. If the fetch fails or the data
 * looks wrong, the script keeps the committed snapshot and exits with code 0,
 * so a Yahoo outage never breaks the deploy.
 */
import { writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/aapl.json', import.meta.url);
const START = Math.floor(Date.UTC(2007, 0, 1) / 1000);
const HOSTS = ['query2.finance.yahoo.com', 'query1.finance.yahoo.com'];
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const round = (n, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

async function fetchChart(host) {
  const now = Math.floor(Date.now() / 1000);
  const url =
    `https://${host}/v8/finance/chart/AAPL?period1=${START}&period2=${now}` +
    '&interval=1d&events=div%2Csplit&includeAdjustedClose=true';
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${host} responded ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`${host} returned no chart result`);
  return result;
}

function toSnapshot(result) {
  const { meta, timestamp } = result;
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const adjCloses = result.indicators?.adjclose?.[0]?.adjclose ?? [];
  const offset = meta.gmtoffset ?? -14400;
  const toDay = (t) => new Date((t + offset) * 1000).toISOString().slice(0, 10);

  const dates = [];
  const close = [];
  const adjClose = [];
  timestamp.forEach((t, i) => {
    const c = closes[i];
    const a = adjCloses[i];
    if (typeof c !== 'number' || typeof a !== 'number' || !(c > 0) || !(a > 0)) return;
    const day = toDay(t);
    if (dates.at(-1) === day) return;
    dates.push(day);
    close.push(round(c));
    adjClose.push(round(a));
  });

  // The latest regular-market price is the "today" value. Make sure the
  // history ends on that trading day with that price.
  const price = meta.regularMarketPrice;
  const marketDay = toDay(meta.regularMarketTime);
  if (dates.at(-1) === marketDay) {
    close[close.length - 1] = round(price);
    adjClose[adjClose.length - 1] = round(price);
  } else if (!dates.length || dates.at(-1) < marketDay) {
    dates.push(marketDay);
    close.push(round(price));
    adjClose.push(round(price));
  }
  const previousClose = close.at(-2);

  return {
    symbol: 'AAPL',
    source: 'Yahoo Finance',
    fetchedAt: new Date().toISOString(),
    quote: {
      price: round(price, 2),
      previousClose: round(previousClose, 2),
      change: round(price - previousClose, 2),
      changePercent: round(((price - previousClose) / previousClose) * 100, 2),
      marketTime: new Date(meta.regularMarketTime * 1000).toISOString(),
      marketDay,
    },
    history: { dates, close, adjClose },
  };
}

function validate(snapshot) {
  const { history, quote } = snapshot;
  if (history.dates.length < 4000) throw new Error(`only ${history.dates.length} trading days`);
  if (history.dates[0] > '2007-01-31') throw new Error(`history starts late (${history.dates[0]})`);
  if (!(quote.price > 0 && Number.isFinite(quote.price))) throw new Error('invalid price');
  const ageDays = (Date.now() - Date.parse(quote.marketDay)) / 86_400_000;
  if (ageDays > 10) throw new Error(`latest trading day is ${quote.marketDay}, too old`);
}

async function main() {
  for (const host of HOSTS) {
    try {
      const snapshot = toSnapshot(await fetchChart(host));
      validate(snapshot);
      await writeFile(OUT, JSON.stringify(snapshot));
      console.log(
        `AAPL ${snapshot.quote.price} on ${snapshot.quote.marketDay}; ` +
          `${snapshot.history.dates.length} trading days from ${host}`,
      );
      return;
    } catch (err) {
      console.warn(`Fetch from ${host} failed: ${err.message}`);
    }
  }
  console.warn('Keeping the committed snapshot in src/data/aapl.json.');
}

main();
