import { useMemo, useState } from 'react';
import { Check, Link as LinkIcon, RotateCcw } from 'lucide-react';
import type { Basis, Holding } from '../types';
import { presets, summarize, timeline } from '../lib/calc';
import { money, multiple, signedMoney } from '../lib/format';
import { GrowthChart } from './GrowthChart';
import { Legend, LineKey, Stat } from './ui';

interface Props {
  holdings: Holding[];
  owned: string[];
  onChange: (ids: string[]) => void;
  basis: Basis;
}

export function Portfolio({ holdings, owned, onChange, basis }: Props) {
  const [copied, setCopied] = useState(false);
  const ownedSet = useMemo(() => new Set(owned), [owned]);
  const mine = useMemo(() => holdings.filter((h) => ownedSet.has(h.id)), [holdings, ownedSet]);
  const summary = summarize(mine);
  const points = useMemo(() => timeline(mine, basis), [mine, basis]);
  const presetList = useMemo(() => presets(holdings), [holdings]);

  const byYear = useMemo(() => {
    const groups = new Map<string, Holding[]>();
    for (const h of holdings) {
      const yr = h.releaseDate.slice(0, 4);
      groups.set(yr, [...(groups.get(yr) ?? []), h]);
    }
    return [...groups.entries()];
  }, [holdings]);

  const toggle = (id: string) => {
    const next = new Set(ownedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(holdings.filter((h) => next.has(h.id)).map((h) => h.id));
  };

  const activePreset = presetList.find(
    (p) => p.ids.length === owned.length && p.ids.every((id) => ownedSet.has(id)),
  )?.id;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; the URL bar still holds the link */
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-ink-2">Quick picks</span>
          {presetList.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              aria-pressed={activePreset === p.id}
              onClick={() => onChange(p.ids)}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            onClick={() => onChange([])}
            disabled={!owned.length}
            aria-label="Clear all selections"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="sr-only">iPhones you have owned</legend>
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {byYear.map(([yr, list]) => (
              <div key={yr} className="flex gap-3">
                <span className="num w-10 shrink-0 pt-1.5 text-sm font-semibold text-muted">{yr}</span>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((h) => {
                    const on = ownedSet.has(h.id);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        className="chip !py-1"
                        aria-pressed={on}
                        onClick={() => toggle(h.id)}
                      >
                        {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        {h.model.replace(/^iPhone /, '') || 'iPhone'}
                        <span className="sr-only">, ${h.msrp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="card p-5 sm:p-6">
        {mine.length === 0 ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold text-ink">Pick the iPhones you’ve owned</p>
            <p className="mt-2 max-w-sm text-ink-2">
              Tap each model on the left, or start from a quick pick. We’ll add up what you spent and what the same
              money would be worth in AAPL.
            </p>
          </div>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              <Stat label={`${summary.count} iPhone${summary.count === 1 ? '' : 's'}`} value={money(summary.spent)} detail="spent" />
              <Stat label="In AAPL instead" value={money(summary.value)} detail="worth today" />
              <Stat
                label="Difference"
                value={signedMoney(summary.gain)}
                tone={summary.gain >= 0 ? 'good' : 'bad'}
              />
              <Stat label="Multiple" value={multiple(summary.multiple)} />
            </dl>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Legend
                items={[
                  { key: <LineKey color="var(--stock)" />, label: 'Value if invested in AAPL' },
                  { key: <LineKey color="var(--cost)" />, label: 'Total spent on iPhones' },
                ]}
              />
              <button type="button" className="btn-ghost !py-1.5" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                {copied ? 'Link copied' : 'Copy share link'}
              </button>
            </div>
            <div className="mt-4">
              <GrowthChart
                points={points}
                height={320}
                label="Your iPhone purchases invested in AAPL instead, compared with the running total spent."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
