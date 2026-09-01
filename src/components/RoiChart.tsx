import React, { useState } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { BarChart3, Percent, DollarSign, ArrowUpRight } from 'lucide-react';

interface RoiChartProps {
  models: IPhoneCalculation[];
  onSelectModel: (model: IPhoneCalculation) => void;
  selectedModelId: string;
}

export const RoiChart: React.FC<RoiChartProps> = ({
  models,
  onSelectModel,
  selectedModelId,
}) => {
  const [metric, setMetric] = useState<'roi' | 'value'>('roi');
  const [hoveredModel, setHoveredModel] = useState<IPhoneCalculation | null>(null);

  // Maximum value for scaling
  const maxRoi = Math.max(...models.map(m => m.roi));
  const maxValue = Math.max(...models.map(m => m.investedValue));

  return (
    <div className="apple-card p-6 sm:p-7 rounded-3xl relative overflow-hidden border border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Timeline & Return Visualizer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual comparison of investment returns across all 49 iPhone releases.
          </p>
        </div>

        {/* Metric Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/10">
          <button
            onClick={() => setMetric('roi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              metric === 'roi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>ROI (%)</span>
          </button>
          <button
            onClick={() => setMetric('value')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              metric === 'value'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Invested Value ($)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas / SVG Container */}
      <div className="mt-6">
        <div className="h-64 sm:h-72 w-full flex items-end gap-1 sm:gap-1.5 pt-8 pb-6 px-2 overflow-x-auto relative">
          {models.map((model) => {
            const heightPercent = metric === 'roi'
              ? Math.max(3, (model.roi / maxRoi) * 100)
              : Math.max(3, (model.investedValue / maxValue) * 100);

            const isSelected = model.id === selectedModelId;
            const isHovered = hoveredModel?.id === model.id;

            return (
              <div
                key={model.id}
                className="flex-1 min-w-[14px] sm:min-w-[18px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredModel(model)}
                onMouseLeave={() => setHoveredModel(null)}
                onClick={() => onSelectModel(model)}
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-blue-600 to-blue-400 ring-2 ring-blue-400 shadow-lg shadow-blue-500/50'
                      : isHovered
                      ? 'bg-gradient-to-t from-emerald-500 to-blue-400'
                      : model.roi > 10
                      ? 'bg-gradient-to-t from-indigo-700/80 to-blue-500/80 hover:from-indigo-600 hover:to-blue-400'
                      : 'bg-gradient-to-t from-slate-700/80 to-slate-500/80 hover:from-slate-600 hover:to-slate-400'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Year Label */}
                <span className="text-[9px] text-slate-500 mt-2 font-mono group-hover:text-slate-200 transition">
                  {model.releaseDate.split('-')[0].slice(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hover / Selection Detail Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          {hoveredModel || models.find(m => m.id === selectedModelId) ? (
            (() => {
              const active = hoveredModel || models.find(m => m.id === selectedModelId)!;
              return (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{active.model}</span>
                    <span className="text-slate-400">Launch: {active.releaseDate}</span>
                    <span className="text-slate-400">MSRP: {formatCurrency(active.modelPrice)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-500">Value Today: </span>
                      <span className="font-bold text-blue-400">{formatCurrency(active.investedValue)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Gain (ROI): </span>
                      <span className="font-bold text-emerald-400">+{formatPercentage(active.roi)}</span>
                    </div>
                    <button
                      onClick={() => onSelectModel(active)}
                      className="px-2 py-1 rounded-md bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-medium flex items-center gap-1 transition"
                    >
                      <span>Simulate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              );
            })()
          ) : (
            <span className="text-slate-400">Hover over any bar to view returns or click to open in simulator.</span>
          )}
        </div>
      </div>
    </div>
  );
};
