import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { MARKET } from '../lib/market';
import { money2, pct } from '../lib/format';
import { useTheme } from '../lib/hooks';
import { Switch } from './ui';

const LINKS = [
  { href: '#chart', label: 'Chart' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#rankings', label: 'Rankings' },
  { href: '#yours', label: 'Your iPhones' },
  { href: '#data', label: 'Data' },
  { href: '#method', label: 'Method' },
];

interface Props {
  dividends: boolean;
  onDividends: (on: boolean) => void;
}

export function Nav({ dividends, onDividends }: Props) {
  const { theme, toggle } = useTheme();
  const { quote } = MARKET;
  const up = quote.change >= 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line backdrop-blur-xl" style={{ background: 'var(--nav)' }}>
      <div className="mx-auto flex h-14 max-w-page items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-ink">
          <img src="./favicon.svg" alt="" width="22" height="22" />
          <span>
            iPhone <span className="text-muted">vs</span> AAPL
          </span>
        </a>

        <nav aria-label="Sections" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3 py-1.5 text-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <p className="hidden items-baseline gap-1.5 text-sm md:flex" title={`AAPL close on ${quote.marketDay}`}>
            <span className="font-semibold text-ink">AAPL</span>
            <span className="num text-ink">{money2(quote.price)}</span>
            <span className={clsx('num text-xs font-medium', up ? 'text-good' : 'text-bad')}>
              {pct(quote.changePercent / 100, 2)}
            </span>
          </p>
          <Switch
            id="nav-dividends"
            checked={dividends}
            onChange={onDividends}
            label={
              <span className="whitespace-nowrap">
                <span className="sm:hidden">Dividends</span>
                <span className="hidden sm:inline">Reinvest dividends</span>
              </span>
            }
          />
          <button
            type="button"
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>
    </header>
  );
}
