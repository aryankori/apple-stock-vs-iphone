import { ArrowRight } from 'lucide-react';
import type { Holding } from '../types';
import type { Summary } from '../lib/calc';
import { MARKET } from '../lib/market';
import { day, money, money2, multiple } from '../lib/format';
import { useCountUp } from '../lib/hooks';
import { Switch } from './ui';

interface Props {
  summary: Summary;
  holdings: Holding[];
  dividends: boolean;
  onDividends: (on: boolean) => void;
}

export function Hero({ summary, holdings, dividends, onDividends }: Props) {
  const animated = useCountUp(summary.value);
  const first = holdings[0];
  const last = holdings[holdings.length - 1];
  const best = holdings.reduce((b, h) => (h.multiple > b.multiple ? h : b), holdings[0]);
  const spentShare = Math.max(0.6, (summary.spent / summary.value) * 100);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(40% 50% at 30% 40%, var(--stock-wash), transparent 70%), radial-gradient(30% 40% at 75% 30%, rgba(235,104,52,0.10), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-page px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-24">
        <p className="eyebrow animate-rise">
          {summary.count} iPhones · {first.releaseDate.slice(0, 4)} to {last.releaseDate.slice(0, 4)}
        </p>
        <h1
          className="mt-3 max-w-4xl animate-rise text-5xl font-extrabold tracking-tight text-ink [text-wrap:balance] sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '60ms' }}
        >
          Buy the iPhone, or buy the stock?
        </h1>
        <p
          className="mt-5 max-w-2xl animate-rise text-lg leading-relaxed text-ink-2 [text-wrap:pretty] sm:text-xl"
          style={{ animationDelay: '120ms' }}
        >
          Take the launch price of every iPhone Apple has sold, buy Apple shares on the day each one went on sale, and
          hold them until today. Here is what that would be worth.
        </p>

        <div className="card mt-10 animate-rise p-6 sm:p-10" style={{ animationDelay: '180ms' }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-sm font-medium text-ink-2 sm:text-base">
              Every iPhone, bought as AAPL on launch day, is worth today
            </p>
            <Switch
              id="hero-dividends"
              checked={dividends}
              onChange={onDividends}
              label="Reinvest dividends"
            />
          </div>
          <p className="mt-2 text-6xl font-bold tracking-tight text-ink sm:text-7xl lg:text-8xl" aria-live="polite">
            {money(animated)}
          </p>
          <p className="mt-3 text-base text-ink-2 sm:text-lg">
            from <span className="font-semibold text-ink">{money(summary.spent)}</span> spent on the phones ·{' '}
            <span className="font-semibold text-ink">{multiple(summary.multiple)}</span> what the phones cost
          </p>

          <div className="mt-8 space-y-3" role="img" aria-label={`Spent ${money(summary.spent)} on iPhones compared with ${money(summary.value)} in AAPL`}>
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-ink-2">On iPhones</span>
              <div className="relative h-7 flex-1">
                <div className="h-full rounded-r-[4px] bg-cost" style={{ width: `${spentShare}%` }} />
              </div>
              <span className="num w-20 shrink-0 text-right text-sm font-semibold text-ink">{money(summary.spent)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-ink-2">In AAPL</span>
              <div className="relative h-7 flex-1">
                <div className="h-full origin-left animate-grow rounded-r-[4px] bg-stock" />
              </div>
              <span className="num w-20 shrink-0 text-right text-sm font-semibold text-ink">{money(summary.value)}</span>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted">Best single phone</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {best.model} · {multiple(best.multiple)}
              </dd>
              <dd className="text-sm text-ink-2">
                {money(best.msrp)} → {money(best.value)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Newest phone</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {last.model} · {multiple(last.multiple)}
              </dd>
              <dd className="text-sm text-ink-2">on sale since {day(last.releaseDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">AAPL price used</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">{money2(MARKET.quote.price)}</dd>
              <dd className="text-sm text-ink-2">close on {day(MARKET.quote.marketDay)}</dd>
            </div>
          </dl>
        </div>

        <a href="#calculator" className="btn-primary mt-8">
          Try it with one phone <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
