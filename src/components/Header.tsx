import React from 'react';
import { StockQuote } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { RefreshCw, Download, BookOpen, TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';

interface HeaderProps {
  quote: StockQuote;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenGuide: () => void;
  lastRefreshed: Date;
}

export const Header: React.FC<HeaderProps> = ({
  quote,
  isLoading,
  onRefresh,
  onOpenGuide,
  lastRefreshed,
}) => {
  const isPositive = quote.change >= 0;

  const handleDownloadSheet = () => {
    // Trigger download of the updated workbook
    const link = document.createElement('a');
    link.href = '/outsoucrd apple sheet.xlsx';
    link.download = 'outsoucrd apple sheet.xlsx';
    link.click();
  };

  return (
    <header className="border-b border-white/10 bg-apple-dark/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.77-.95 2.83 1.02.08 2.05-.51 2.68-1.28z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Apple Stock vs iPhone</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Model
              </span>
            </div>
            <p className="text-xs text-slate-400">Historical Hardware Cost vs $AAPL Investment Return</p>
          </div>
        </div>

        {/* Live Stock Ticker & Quick Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Live AAPL Price Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">AAPL</span>
              <span className="text-sm font-bold text-white">{formatCurrency(quote.price)}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)} ({formatPercentage(quote.changePercent / 100)})</span>
            </div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh live stock price"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* Last Update Info */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{lastRefreshed.toLocaleTimeString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>STE Guide</span>
            </button>

            <button
              onClick={handleDownloadSheet}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
