import React from 'react';
import { StockQuote } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { RefreshCw, Download, Terminal, Monitor, Sparkles } from 'lucide-react';

interface HeaderProps {
  quote: StockQuote;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenGuide: () => void;
  lastRefreshed: Date;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  theme: 'green' | 'amber';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  quote,
  isLoading,
  onRefresh,
  onOpenGuide,
  lastRefreshed,
  crtEnabled,
  onToggleCrt,
  theme,
  onToggleTheme,
}) => {
  const isPositive = quote.change >= 0;
  const isGreen = theme === 'green';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';

  const handleDownloadSheet = () => {
    const link = document.createElement('a');
    link.href = '/outsoucrd apple sheet.xlsx';
    link.download = 'outsoucrd apple sheet.xlsx';
    link.click();
  };

  return (
    <header className={`border-b ${borderColor} bg-[#080808] sticky top-0 z-40`}>
      {/* Top Telemetry Bar */}
      <div className={`px-4 py-1 bg-[#0d0d0d] border-b ${borderColor} text-[11px] font-mono flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#33ff00] animate-ping" />
          <span className="text-[#33ff00] font-bold">SYSTEM ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">HOST: apple-mainframe.corp</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">TTY: /dev/pts/0</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>TIME: {lastRefreshed.toISOString().slice(11, 19)} UTC</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">[NET: VERIFIED]</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & ASCII Logo */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <div className={`p-2.5 bg-[#0e160e] border ${borderColor} text-[#33ff00]`}>
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base sm:text-lg font-extrabold uppercase tracking-wider ${primaryText}`}>
                AAPL_MAINFRAME // STOCK VS IPHONE
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1f521f]/50 text-[#33ff00] border border-[#1f521f]">
                v2026.1
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              &gt; Hardware Purchase vs Capital Investment Allocation Model
            </p>
          </div>
        </div>

        {/* Live Market Ticker & System Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full lg:w-auto">
          {/* Live AAPL Ticker Box */}
          <div className={`px-3 py-1.5 bg-[#0d0d0d] border ${borderColor} flex items-center gap-2.5 text-xs font-mono`}>
            <span className="text-slate-400 font-bold">$AAPL:</span>
            <span className="text-white font-bold text-sm">{formatCurrency(quote.price)}</span>
            <span className={`font-bold ${isPositive ? 'text-[#33ff00]' : 'text-red-400'}`}>
              [{isPositive ? '+' : ''}{quote.change.toFixed(2)} / {formatPercentage(quote.changePercent / 100)}]
            </span>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh live market price"
              className="p-1 hover:bg-[#1f521f]/50 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#33ff00]' : ''}`} />
            </button>
          </div>

          {/* CRT Scanlines Toggle */}
          <button
            onClick={onToggleCrt}
            className={`terminal-btn flex items-center gap-1.5 ${crtEnabled ? 'bg-[#1f521f]/40 text-[#33ff00]' : 'text-slate-500'}`}
          >
            <Monitor className="w-3 h-3" />
            <span>[CRT: {crtEnabled ? 'ON' : 'OFF'}]</span>
          </button>

          {/* Color Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className={`terminal-btn flex items-center gap-1.5 ${theme === 'amber' ? 'terminal-btn-amber' : ''}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>[{theme === 'green' ? 'PHOSPHOR' : 'AMBER'}]</span>
          </button>

          {/* STE Documentation Button */}
          <button
            onClick={onOpenGuide}
            className="terminal-btn flex items-center gap-1.5"
          >
            <span>[ MAN AAPL ]</span>
          </button>

          {/* Excel Download Button */}
          <button
            onClick={handleDownloadSheet}
            className="terminal-btn bg-[#1f521f]/30 hover:bg-[#33ff00] hover:text-black flex items-center gap-1.5"
          >
            <Download className="w-3 h-3" />
            <span>[ EXCEL.XLSX ]</span>
          </button>
        </div>
      </div>
    </header>
  );
};
