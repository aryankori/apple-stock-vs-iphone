import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { Basis, Holding } from '../types';
import { invest, timeline } from '../lib/calc';
import { DATES, TODAY } from '../lib/market';
import { day, money, money2, month, multiple, pct, shares, signedMoney } from '../lib/format';
import { GrowthChart } from './GrowthChart';
import { Legend, LineKey, Segmented, Stat } from './ui';

type Mode = 'phone' | 'custom';

const QUICK_AMOUNTS = [100, 1000, 10000];
const yearsAgo = (n: number) => `${Number(TODAY.slice(0, 4)) - n}${TODAY.slice(4)}`;
const QUICK_DATES = [
  { label: '1 year ago', date: yearsAgo(1) },
  { label: '5 years ago', date: yearsAgo(5) },
  { label: '10 years ago', date: yearsAgo(10) },
];

interface Props {
  holdings: Holding[];
  selected: Holding;
  onSelect: (id: string) => void;
  basis: Basis;
  /** The newest, most expensive iPhone: the "you could buy this many" yardstick. */
  flagship: Holding;
}

export function Calculator({ holdings, selected: phone, onSelect, basis, flagship }: Props) {
  const [mode, setMode] = useState<Mode>('phone');
  const [amountText, setAmountText] = useState('1000');
  const [date, setDate] = useState(yearsAgo(10));

  const amount = Math.max(0, Number.parseFloat(amountText) || 0);
  const safeDate = date >= DATES[0] && date <= TODAY ? date : DATES[0];
  const custom = useMemo<Holding>(
    () => ({
      id: 'custom',
      model: `Your ${money(amount)}`,
      releaseDate: safeDate,
      msrp: amount,
      launchClose: 0,
      ...invest(amount, safeDate, basis),
    }),
    [amount, safeDate, basis],
  );

  // Picking a phone anywhere on the page (chart, table) brings the calculator back to phone mode.
  useEffect(() => setMode('phone'), [phone.id]);

  const isPhone = mode === 'phone';
  const selected = isPhone ? phone : custom;
  const index = holdings.findIndex((h) => h.id === phone.id);
  const points = useMemo(() => timeline([selected], basis), [selected, basis]);
  const byYear = useMemo(() => {
    const groups = new Map<string, Holding[]>();
    for (const h of holdings) {
      const yr = h.releaseDate.slice(0, 4);
      groups.set(yr, [...(groups.get(yr) ?? []), h]);
    }
    return [...groups.entries()];
  }, [holdings]);

  const go = (delta: number) => {
    const next = Math.min(holdings.length - 1, Math.max(0, index + delta));
    onSelect(holdings[next].id);
  };

  const phonesToday = selected.value / flagship.msrp;
  const up = selected.gain >= 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="card p-5 sm:p-8">
        <Segmented<Mode>
          label="What to invest"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'phone', label: 'An iPhone' },
            { value: 'custom', label: 'Any amount & date' },
          ]}
        />

        {isPhone ? (
          <div className="mt-6">
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-0 flex-1">
                <span className="text-sm font-medium text-ink-2">Choose an iPhone</span>
                <span className="relative mt-1.5 block">
                  <select
                    value={phone.id}
                    onChange={(e) => onSelect(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-surface-2 py-3 pl-4 pr-10 text-base font-semibold text-ink ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {byYear.map(([yr, list]) => (
                      <optgroup key={yr} label={yr}>
                        {list.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.model} (${h.msrp.toLocaleString('en-US')})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                  />
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-ghost h-12 w-12 !px-0"
                  onClick={() => go(-1)}
                  disabled={index === 0}
                  aria-label="Previous iPhone"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="btn-ghost h-12 w-12 !px-0"
                  onClick={() => go(1)}
                  disabled={index === holdings.length - 1}
                  aria-label="Next iPhone"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <input
                type="range"
                className="slider"
                min={0}
                max={holdings.length - 1}
                step={1}
                value={index}
                onChange={(e) => onSelect(holdings[Number(e.target.value)].id)}
                aria-label="Scrub through every iPhone in release order"
                aria-valuetext={`${phone.model}, ${month(phone.releaseDate)}`}
                style={{ ['--fill' as string]: `${(index / (holdings.length - 1)) * 100}%` }}
              />
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>{holdings[0].releaseDate.slice(0, 4)}</span>
                <span>Drag through time</span>
                <span>{holdings[holdings.length - 1].releaseDate.slice(0, 4)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="custom-amount" className="text-sm font-medium text-ink-2">
                Amount (USD)
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted">$</span>
                <input
                  id="custom-amount"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="any"
                  value={amountText}
                  onChange={(e) => setAmountText(e.target.value)}
                  className="w-full rounded-xl bg-surface-2 py-3 pl-8 pr-4 text-base font-semibold text-ink ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="chip !py-1"
                    aria-pressed={amount === a}
                    onClick={() => setAmountText(String(a))}
                  >
                    {money(a)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="custom-date" className="text-sm font-medium text-ink-2">
                Date bought
              </label>
              <input
                id="custom-date"
                type="date"
                min={DATES[0]}
                max={TODAY}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl bg-surface-2 px-4 py-3 text-base font-semibold text-ink ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_DATES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    className="chip !py-1"
                    aria-pressed={date === q.date}
                    onClick={() => setDate(q.date)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-8 text-xl leading-snug text-ink-2 [text-wrap:balance] sm:text-2xl">
          {isPhone ? (
            <>
              The <span className="font-semibold text-ink">{money(selected.msrp)}</span> for an{' '}
              <span className="font-semibold text-ink">{selected.model}</span> in {month(selected.releaseDate)}, put
              into Apple stock instead, would be worth{' '}
            </>
          ) : (
            <>
              <span className="font-semibold text-ink">{money(selected.msrp)}</span> put into Apple stock on{' '}
              <span className="font-semibold text-ink">{day(selected.buyDate)}</span> would be worth{' '}
            </>
          )}
          <span className="font-semibold text-ink">{money(selected.value)}</span> today.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
          <Stat label="Value today" value={money(selected.value)} detail={`from ${money(selected.msrp)}`} />
          <Stat
            label={up ? 'Gain' : 'Loss'}
            value={signedMoney(selected.gain)}
            detail={pct(selected.multiple - 1, 0)}
            tone={up ? 'good' : 'bad'}
          />
          <Stat
            label="Multiple"
            value={multiple(selected.multiple)}
            detail={isPhone ? 'of the phone’s price' : 'of the amount'}
          />
          <Stat
            label="Shares bought"
            value={shares(selected.sharesBought)}
            detail={`at ${money2(selected.buyPrice)} each`}
          />
          <Stat
            label="Annual return"
            value={selected.cagr === null ? '—' : pct(selected.cagr)}
            detail={selected.cagr === null ? 'held under a year' : 'compounded, per year'}
          />
          <Stat
            label="Held for"
            value={selected.years >= 1 ? `${selected.years.toFixed(1)} yrs` : `${Math.round(selected.years * 365)} days`}
            detail={`since ${day(selected.buyDate)}`}
          />
        </dl>

        <div className="mt-8 rounded-2xl bg-surface-2 p-4 sm:p-5">
          <p className="text-sm text-ink-2">
            {phonesToday >= 1 ? (
              <>
                Enough to buy{' '}
                <span className="font-semibold text-ink">
                  {Math.floor(phonesToday)} {flagship.model}
                  {Math.floor(phonesToday) === 1 ? '' : 's'}
                </span>{' '}
                at {money(flagship.msrp)} each today.
              </>
            ) : (
              <>
                Not enough for a new <span className="font-semibold text-ink">{flagship.model}</span> yet:{' '}
                {Math.round(phonesToday * 100)}% of the way there.
              </>
            )}
          </p>
          <PhoneRow count={phonesToday} />
        </div>
      </div>

      <PhoneMockup
        selected={selected}
        title={isPhone ? `${selected.model} money` : `${money(selected.msrp)} from ${month(selected.buyDate)}`}
        costLabel={isPhone ? 'Phone price' : 'Amount put in'}
        caption={
          isPhone
            ? 'The phone charts its own price in AAPL, from launch day to today.'
            : 'The phone charts your amount in AAPL, from the day you bought to today.'
        }
      >
        <GrowthChart
          points={points}
          height={250}
          compact
          spentLabel={isPhone ? 'phone price' : 'put in'}
          label={`${money(selected.msrp)} invested in AAPL, from ${day(selected.buyDate)} to ${day(TODAY)}.`}
        />
      </PhoneMockup>
    </div>
  );
}

const MAX_GLYPHS = 60;

/** A row of phone glyphs: one per flagship the money could buy, plus a partial one. */
function PhoneRow({ count }: { count: number }) {
  const whole = Math.floor(count);
  const shown = Math.min(whole, MAX_GLYPHS);
  const partial = whole < MAX_GLYPHS ? count - whole : 0;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1" aria-hidden="true">
      {Array.from({ length: shown }, (_, i) => (
        <PhoneGlyph key={i} fill={1} delay={i} />
      ))}
      {partial > 0.02 && <PhoneGlyph fill={partial} delay={shown} />}
      {whole > MAX_GLYPHS && <span className="ml-1 text-sm font-medium text-ink-2">+{whole - MAX_GLYPHS} more</span>}
    </div>
  );
}

function PhoneGlyph({ fill, delay }: { fill: number; delay: number }) {
  const h = 24;
  const inner = (h - 2) * fill;
  return (
    <svg
      width="13"
      height={h}
      viewBox={`0 0 13 ${h}`}
      className="animate-rise"
      style={{ animationDelay: `${Math.min(delay, 40) * 12}ms` }}
    >
      <rect x="0.75" y="0.75" width="11.5" height={h - 1.5} rx="3" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x="1" y={1 + (h - 2 - inner)} width="11" height={inner} rx="2.5" fill="var(--ink-2)" />
    </svg>
  );
}

interface MockupProps {
  selected: Holding;
  title: string;
  costLabel: string;
  caption: string;
  children: ReactNode;
}

function PhoneMockup({ selected, title, costLabel, caption, children }: MockupProps) {
  const up = selected.gain >= 0;
  return (
    <figure className="mx-auto w-full max-w-[340px] lg:sticky lg:top-24">
      <div className="rounded-[52px] bg-[#1d1d1f] p-3 shadow-2xl ring-1 ring-black/10 dark:bg-[#2c2c2e]">
        <div className="relative overflow-hidden rounded-[40px] bg-surface px-4 pb-6 pt-12">
          <div className="absolute left-1/2 top-3 h-7 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">AAPL · since {selected.buyDate.slice(0, 4)}</p>
          <p className="mt-1 truncate text-sm font-medium text-ink-2">{title}</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-ink">{money(selected.value)}</p>
          <p className={clsx('mt-1 text-sm font-semibold', up ? 'text-good' : 'text-bad')}>
            {signedMoney(selected.gain)} ({pct(selected.multiple - 1, 0)})
          </p>
          <div className="mt-4">{children}</div>
          <div className="mt-3">
            <Legend
              items={[
                { key: <LineKey color="var(--stock)" />, label: 'Invested' },
                { key: <LineKey color="var(--cost)" />, label: costLabel },
              ]}
            />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}
