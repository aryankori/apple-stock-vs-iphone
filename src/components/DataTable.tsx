import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, Download, FileSpreadsheet, Search } from 'lucide-react';
import type { Basis, Holding } from '../types';
import { summarize } from '../lib/calc';
import { TODAY } from '../lib/market';
import { day, money, money2, multiple, shares, signedMoney } from '../lib/format';

type Key = 'releaseDate' | 'model' | 'msrp' | 'buyPrice' | 'sharesNow' | 'value' | 'gain' | 'multiple';

interface Column {
  key: Key;
  label: string;
  numeric?: boolean;
  render: (h: Holding) => string;
}

interface Props {
  holdings: Holding[];
  selectedId: string;
  onSelect: (id: string) => void;
  basis: Basis;
}

const XLSX_URL = `./${encodeURIComponent('outsoucrd apple sheet.xlsx')}`;

export function DataTable({ holdings, selectedId, onSelect, basis }: Props) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'releaseDate', dir: 1 });
  const [query, setQuery] = useState('');

  const columns: Column[] = [
    { key: 'model', label: 'Model', render: (h) => h.model },
    { key: 'releaseDate', label: 'Released', render: (h) => day(h.releaseDate) },
    { key: 'msrp', label: 'Launch price', numeric: true, render: (h) => money(h.msrp) },
    { key: 'buyPrice', label: 'AAPL that day', numeric: true, render: (h) => money2(h.buyPrice) },
    {
      key: 'sharesNow',
      label: basis === 'total' ? 'Shares now' : 'Shares',
      numeric: true,
      render: (h) => shares(h.sharesNow),
    },
    { key: 'value', label: 'Worth today', numeric: true, render: (h) => money(h.value) },
    { key: 'gain', label: 'Gain', numeric: true, render: (h) => signedMoney(h.gain) },
    { key: 'multiple', label: 'Multiple', numeric: true, render: (h) => multiple(h.multiple) },
  ];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? holdings.filter((h) => h.model.toLowerCase().includes(q) || h.releaseDate.startsWith(q))
      : holdings;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return (cmp || a.releaseDate.localeCompare(b.releaseDate)) * sort.dir;
    });
  }, [holdings, query, sort]);

  const total = summarize(rows);

  const onSort = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === 'model' || key === 'releaseDate' ? 1 : -1 }));

  const downloadCsv = () => {
    const header = ['Model', 'Release date', 'Launch price (USD)', 'AAPL close that day', 'Shares', 'Value today', 'Gain', 'Multiple'];
    const lines = holdings.map((h) =>
      [
        `"${h.model}"`,
        h.releaseDate,
        h.msrp,
        h.buyPrice.toFixed(4),
        h.sharesNow.toFixed(4),
        h.value.toFixed(2),
        h.gain.toFixed(2),
        h.multiple.toFixed(4),
      ].join(','),
    );
    const csv = [`# AAPL close ${TODAY}; basis: ${basis === 'total' ? 'dividends reinvested' : 'price only'}`, header.join(','), ...lines].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `iphone-vs-aapl-${TODAY}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Filter by model or year</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by model or year"
            className="w-full rounded-full bg-surface-2 py-2 pl-9 pr-4 text-sm text-ink ring-1 ring-inset ring-line placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost !py-1.5" onClick={downloadCsv}>
            <Download className="h-4 w-4" aria-hidden="true" /> CSV
          </button>
          <a className="btn-ghost !py-1.5" href={XLSX_URL} download>
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> Excel workbook
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <caption className="sr-only">
            Every iPhone with its launch price and what that money would be worth in AAPL today. Select a row to
            open it in the calculator.
          </caption>
          <thead>
            <tr className="border-b border-line text-left">
              {columns.map((c) => {
                const active = sort.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}
                    className={clsx('whitespace-nowrap px-4 py-3 font-medium text-muted', c.numeric && 'text-right')}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={clsx('inline-flex items-center gap-1 hover:text-ink', active && 'text-ink')}
                    >
                      {c.label}
                      {active &&
                        (sort.dir === 1 ? (
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        ))}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr
                key={h.id}
                onClick={() => onSelect(h.id)}
                className={clsx(
                  'cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-surface-2',
                  h.id === selectedId && 'bg-surface-2',
                )}
              >
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={clsx(
                      'whitespace-nowrap px-4 py-2.5',
                      c.numeric && 'num text-right',
                      ci === 0 || c.key === 'value'
                        ? 'font-medium text-ink'
                        : c.key === 'gain'
                          ? h.gain >= 0
                            ? 'text-good'
                            : 'text-bad'
                          : 'text-ink-2',
                    )}
                  >
                    {ci === 0 ? (
                      <button
                        type="button"
                        className="text-left hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(h.id);
                        }}
                      >
                        {c.render(h)}
                      </button>
                    ) : (
                      c.render(h)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-line bg-surface-2 font-semibold text-ink">
              <td className="px-4 py-3">Total · {total.count} phones</td>
              <td />
              <td className="num px-4 py-3 text-right">{money(total.spent)}</td>
              <td />
              <td />
              <td className="num px-4 py-3 text-right">{money(total.value)}</td>
              <td className="num px-4 py-3 text-right text-good">{signedMoney(total.gain)}</td>
              <td className="num px-4 py-3 text-right">{multiple(total.multiple)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
