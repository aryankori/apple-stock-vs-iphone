import { useCallback, useEffect, useMemo, useState } from 'react';
import { IPHONES } from './data/iphones';
import { evaluateAll, presets, summarize } from './lib/calc';
import type { Basis } from './types';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { PriceChart } from './components/PriceChart';
import { Calculator } from './components/Calculator';
import { RankingChart } from './components/RankingChart';
import { Portfolio } from './components/Portfolio';
import { DataTable } from './components/DataTable';
import { Method } from './components/Method';
import { Section } from './components/ui';

const IDS = new Set(IPHONES.map((p) => p.id));
const DEFAULT_MODEL = IPHONES[0].id;
/** Until the visitor picks their own, the history builder shows an example upgrade path. */
const DEFAULT_OWNED = presets(IPHONES).find((p) => p.id === 'every-other')!.ids;
const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((id, i) => id === b[i]);

/** App state lives in the query string, so any view can be shared as a link. */
function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const model = params.get('model');
  const owned = params.has('owned')
    ? (params.get('owned') ?? '').split(',').filter((id) => IDS.has(id))
    : DEFAULT_OWNED;
  return {
    model: model && IDS.has(model) ? model : DEFAULT_MODEL,
    owned,
    basis: (params.get('dividends') === '1' ? 'total' : 'price') as Basis,
  };
}

export default function App() {
  const initial = useMemo(readUrl, []);
  const [selectedId, setSelectedId] = useState(initial.model);
  const [owned, setOwned] = useState<string[]>(initial.owned);
  const [basis, setBasis] = useState<Basis>(initial.basis);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedId !== DEFAULT_MODEL) params.set('model', selectedId);
    if (!sameIds(owned, DEFAULT_OWNED)) params.set('owned', owned.join(','));
    if (basis === 'total') params.set('dividends', '1');
    // Commas are legal in a query string; keep the id list readable.
    const qs = params.toString().replace(/%2C/g, ',');
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, [selectedId, owned, basis]);

  const holdings = useMemo(() => evaluateAll(IPHONES, basis), [basis]);
  const summary = useMemo(() => summarize(holdings), [holdings]);
  const selected = holdings.find((h) => h.id === selectedId) ?? holdings[0];
  const flagship = useMemo(
    () =>
      [...holdings].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || b.msrp - a.msrp)[0],
    [holdings],
  );

  const dividends = basis === 'total';
  const setDividends = (on: boolean) => setBasis(on ? 'total' : 'price');

  /** Select a phone from anywhere on the page and bring the calculator into view. */
  const openInCalculator = useCallback((id: string) => {
    setSelectedId(id);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <a
        href="#chart"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Nav dividends={dividends} onDividends={setDividends} />
      <main>
        <Hero summary={summary} holdings={holdings} dividends={dividends} onDividends={setDividends} />

        <Section
          id="chart"
          eyebrow="The stock behind the phones"
          title="Apple’s share price, with every iPhone launch."
          lede="Each orange dot is a day new iPhones went on sale. Hover or tap a dot to see which models launched, and click it to open that phone in the calculator. The log scale shows equal percentage moves as equal heights."
        >
          <PriceChart holdings={holdings} selectedId={selected.id} onSelect={openInCalculator} />
        </Section>

        <Section
          id="calculator"
          eyebrow="Calculator"
          title="Pick an iPhone. See what it would be worth."
          lede="Choose a model, or drag the slider through time. The phone on the right charts that phone’s launch price in AAPL from its launch day to today. Or switch to any amount on any date since 2007."
        >
          <Calculator
            holdings={holdings}
            selected={selected}
            onSelect={setSelectedId}
            basis={basis}
            flagship={flagship}
          />
        </Section>

        <Section
          id="rankings"
          eyebrow="Every model, side by side"
          title="The older the phone, the bigger the win."
          lede="Each column is one iPhone, in release order. Early phones had years of compounding. Recent phones have had little time to grow. Click a column to open it in the calculator."
        >
          <RankingChart holdings={holdings} selectedId={selected.id} onSelect={openInCalculator} />
        </Section>

        <Section
          id="yours"
          eyebrow="Your iPhone history"
          title="What did your upgrades cost you?"
          lede="Select the iPhones you have owned. The chart follows the money from your first phone to today, next to what you spent on the phones."
        >
          <Portfolio holdings={holdings} owned={owned} onChange={setOwned} basis={basis} />
        </Section>

        <Section
          id="data"
          eyebrow="All the numbers"
          title="The full table."
          lede="Sort by any column, filter by model or year, and download the data. Select a row to open it in the calculator."
        >
          <DataTable holdings={holdings} selectedId={selected.id} onSelect={openInCalculator} basis={basis} />
        </Section>

        <Section id="method" eyebrow="Methodology" title="How the numbers work.">
          <Method />
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Not investment advice. Past returns do not predict future returns.</p>
          <div className="flex items-center gap-5">
            <a className="hover:text-ink" href="https://github.com/aryankori/apple-stock-vs-iphone" target="_blank" rel="noreferrer">
              Source on GitHub
            </a>
            <a className="hover:text-ink" href="https://steamcommunity.com/id/Outsourced/" target="_blank" rel="noreferrer">
              Original idea: Outsourced
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
