import type { ReactNode } from 'react';
import { MARKET } from '../lib/market';
import { day } from '../lib/format';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-surface-2 px-4 py-2.5 font-mono text-[13px] text-ink ring-1 ring-inset ring-line">
      {children}
    </p>
  );
}

export function Method() {
  const updated = new Date(MARKET.fetchedAt);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Block title="The math">
        <p>For each iPhone, the model buys AAPL on the day the phone went on sale, for the phone’s launch price.</p>
        <Formula>shares = launch price ÷ AAPL close on launch day</Formula>
        <Formula>value today = shares × latest AAPL close</Formula>
        <Formula>multiple = value today ÷ launch price</Formula>
        <Formula>annual return = multiple^(1 ÷ years held) − 1</Formula>
        <p>
          If a phone went on sale on a weekend or holiday, the model uses the close of the last trading day before
          it.
        </p>
      </Block>

      <Block title="Stock splits and dividends">
        <p>
          Apple split its stock 7-for-1 in June 2014 and 4-for-1 in August 2020. All prices here are split-adjusted,
          so one 2007 share counts as 28 of today’s shares.
        </p>
        <p>
          Apple has paid a quarterly dividend since 2012. With <strong className="text-ink">Reinvest dividends</strong>{' '}
          off, the model ignores them. With it on, each dividend buys more AAPL on its ex-dividend date, using Yahoo
          Finance’s dividend-adjusted closes. Taxes on dividends are not included.
        </p>
      </Block>

      <Block title="What this leaves out">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>You still need a phone. This compares money, not the value of owning one.</li>
          <li>Carrier subsidies, trade-ins, resale value, sales tax and inflation.</li>
          <li>Capital gains tax and trading fees.</li>
          <li>
            Hindsight. Apple is one of the best-performing stocks of the period. The same bet on a different company
            could have lost money.
          </li>
        </ul>
        <p>Launch prices are US prices for the base storage model. This is not investment advice.</p>
      </Block>

      <Block title="Data">
        <p>
          AAPL prices are daily closes from Yahoo Finance. The site rebuilds itself on a schedule on weekdays, so the
          latest close is current to within a trading day.
        </p>
        <p>
          Latest close: <strong className="text-ink">{day(MARKET.quote.marketDay)}</strong>. Data fetched{' '}
          {updated.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.
        </p>
        <p>
          The idea and the original spreadsheet come from{' '}
          <a className="text-accent hover:underline" href="https://steamcommunity.com/id/Outsourced/" target="_blank" rel="noreferrer">
            Outsourced
          </a>
          . Site and data pipeline by{' '}
          <a className="text-accent hover:underline" href="https://github.com/aryankori" target="_blank" rel="noreferrer">
            aryankori
          </a>
          .
        </p>
      </Block>
    </div>
  );
}
