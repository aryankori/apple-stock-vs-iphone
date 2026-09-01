import React from 'react';
import { PortfolioSummary } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { DollarSign, TrendingUp, Trophy, Layers } from 'lucide-react';

interface KpiCardsProps {
  summary: PortfolioSummary;
  theme?: 'green' | 'amber';
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, theme = 'green' }) => {
  const isGreen = theme === 'green';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const headerBg = isGreen ? 'bg-[#0f1a0f]' : 'bg-[#1a1400]';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Hardware Cost */}
      <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor} p-0`}>
        <div className={`flex items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-[11px] font-mono`}>
          <span className="font-bold text-slate-400">SYS_METRIC // 01</span>
          <span className="text-slate-500 font-bold">[HARDWARE_CAPITAL]</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TOTAL IPHONE MSRP:</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
            {formatCurrency(summary.totalCost)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            &gt; 49 retail devices (2007-2026)
          </div>
          {/* ASCII progress bar */}
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            [||||||||||....................] 100% PRINCIPAL
          </div>
        </div>
      </div>

      {/* 2. Invested Value Today */}
      <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor} p-0`}>
        <div className={`flex items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-[11px] font-mono`}>
          <span className={`font-bold ${primaryText}`}>SYS_METRIC // 02</span>
          <span className={`font-bold ${primaryText}`}>[CURRENT_VALUE]</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>STOCK PORTFOLIO TODAY:</span>
            <TrendingUp className={`w-3.5 h-3.5 ${primaryText}`} />
          </div>
          <div className={`text-2xl font-black ${primaryText} mt-1 font-mono tracking-tight`}>
            {formatCurrency(summary.totalInvestedValue)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#33ff00]" />
            <span>SHARES: {summary.totalShares.toFixed(2)} units</span>
          </div>
          {/* ASCII progress bar */}
          <div className="mt-2 text-[10px] text-[#33ff00] font-mono">
            [||||||||||||||||||||||||||||||] +603% COMPOUND
          </div>
        </div>
      </div>

      {/* 3. Net Dollar Profit */}
      <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor} p-0`}>
        <div className={`flex items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-[11px] font-mono`}>
          <span className="font-bold text-[#33ff00]">SYS_METRIC // 03</span>
          <span className="text-[#33ff00] font-bold">[NET_ALPHA_GAIN]</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>NET CAPITAL GAIN:</span>
            <span className="text-[10px] font-mono text-[#33ff00]">[PROFIT]</span>
          </div>
          <div className="text-2xl font-black text-[#33ff00] mt-1 font-mono tracking-tight terminal-glow">
            +{formatCurrency(summary.totalProfit)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            &gt; Value minus hardware principal
          </div>
          <div className="mt-2 text-[10px] text-[#33ff00]/70 font-mono">
            [STATUS: NET POSITIVE RETURN]
          </div>
        </div>
      </div>

      {/* 4. Overall Cumulative ROI */}
      <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor} p-0`}>
        <div className={`flex items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-[11px] font-mono`}>
          <span className="font-bold text-yellow-400">SYS_METRIC // 04</span>
          <span className="text-yellow-400 font-bold">[ROI_RATIO]</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AGGREGATE ROI:</span>
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
            +{formatPercentage(summary.overallRoi)}
          </div>
          <div className="mt-2 text-[11px] text-slate-300 font-mono truncate">
            &gt; TOP: {summary.bestPerformer.model} (+{formatPercentage(summary.bestPerformer.roi)})
          </div>
          <div className="mt-2 text-[10px] text-yellow-400 font-mono">
            [MULTIPLE: {(summary.totalInvestedValue / (summary.totalCost || 1)).toFixed(2)}x INITIAL CAPITAL]
          </div>
        </div>
      </div>
    </div>
  );
};
