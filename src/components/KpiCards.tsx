import React from 'react';
import { PortfolioSummary } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { DollarSign, TrendingUp, Trophy, Layers, Percent, ArrowUpRight } from 'lucide-react';

interface KpiCardsProps {
  summary: PortfolioSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Initial Hardware Spend */}
      <div className="apple-card apple-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Hardware Cost</span>
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(summary.totalCost)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>49 iPhone releases (2007-2026)</span>
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition"></div>
      </div>

      {/* Current Invested Value */}
      <div className="apple-card apple-card-hover p-5 rounded-2xl relative overflow-hidden group border-blue-500/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Invested Value Today</span>
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
            {formatCurrency(summary.totalInvestedValue)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-400" />
            <span>{summary.totalShares.toFixed(2)} total shares acquired</span>
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition"></div>
      </div>

      {/* Net Portfolio Profit */}
      <div className="apple-card apple-card-hover p-5 rounded-2xl relative overflow-hidden group border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Net Dollar Profit</span>
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            +{formatCurrency(summary.totalProfit)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Net cash gain after hardware principal
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
      </div>

      {/* Cumulative Return on Investment */}
      <div className="apple-card apple-card-hover p-5 rounded-2xl relative overflow-hidden group border-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Cumulative ROI</span>
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            +{formatPercentage(summary.overallRoi)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Top: {summary.bestPerformer.model} (+{formatPercentage(summary.bestPerformer.roi)})</span>
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition"></div>
      </div>
    </div>
  );
};
