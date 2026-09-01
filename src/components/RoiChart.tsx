import React, { useState } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { BarChart3, ArrowRight } from 'lucide-react';

interface RoiChartProps {
  models: IPhoneCalculation[];
  onSelectModel: (model: IPhoneCalculation) => void;
  selectedModelId: string;
  theme?: 'green' | 'amber';
}

export const RoiChart: React.FC<RoiChartProps> = ({
  models,
  onSelectModel,
  selectedModelId,
  theme = 'green',
}) => {
  const [metric, setMetric] = useState<'roi' | 'value'>('roi');
  const [hoveredModel, setHoveredModel] = useState<IPhoneCalculation | null>(null);

  const isGreen = theme === 'green';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const headerBg = isGreen ? 'bg-[#0f1a0f]' : 'bg-[#1a1400]';

  const maxRoi = Math.max(...models.map(m => m.roi));
  const maxValue = Math.max(...models.map(m => m.investedValue));

  const activeModel = hoveredModel || models.find(m => m.id === selectedModelId) || models[0];

  return (
    <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor}`}>
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-xs font-mono`}>
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-3.5 h-3.5 ${primaryText}`} />
          <span className={`font-bold uppercase tracking-wider ${primaryText}`}>
            +-- HISTOGRAM // 49-DEVICE RETURN TIMELINE --+
          </span>
        </div>

        {/* Metric Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMetric('roi')}
            className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase transition ${
              metric === 'roi'
                ? 'bg-[#33ff00] text-black'
                : 'border border-[#1f521f] text-slate-400 hover:text-white'
            }`}
          >
            [ METRIC: ROI % ]
          </button>
          <button
            onClick={() => setMetric('value')}
            className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase transition ${
              metric === 'value'
                ? 'bg-[#33ff00] text-black'
                : 'border border-[#1f521f] text-slate-400 hover:text-white'
            }`}
          >
            [ METRIC: VALUE $ ]
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-4 sm:p-5 font-mono">
        <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
          <span>Y-AXIS: {metric === 'roi' ? 'RETURN ON INVESTMENT (%)' : 'EQUITY VALUATION ($ USD)'}</span>
          <span className="text-[#33ff00]">X-AXIS: CHRONOLOGICAL RELEASES (2007-2026)</span>
        </div>

        {/* Monospace Bar Chart Grid */}
        <div className="h-60 w-full flex items-end gap-1 sm:gap-1.5 pt-6 pb-4 px-2 border-b border-l border-[#1f521f] bg-[#070707] overflow-x-auto">
          {models.map((model) => {
            const heightPercent = metric === 'roi'
              ? Math.max(4, (model.roi / maxRoi) * 100)
              : Math.max(4, (model.investedValue / maxValue) * 100);

            const isSelected = model.id === selectedModelId;
            const isHovered = hoveredModel?.id === model.id;

            return (
              <div
                key={model.id}
                className="flex-1 min-w-[12px] sm:min-w-[16px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredModel(model)}
                onMouseLeave={() => setHoveredModel(null)}
                onClick={() => onSelectModel(model)}
              >
                {/* Visual Monospace Bar */}
                <div
                  className={`w-full transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#33ff00] shadow-[0_0_10px_#33ff00]'
                      : isHovered
                      ? 'bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]'
                      : model.roi > 10
                      ? 'bg-[#1f701f] hover:bg-[#33ff00]'
                      : 'bg-[#153515] hover:bg-[#256025]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Release Year Abbreviation */}
                <span className="text-[9px] text-slate-600 mt-1 font-mono group-hover:text-white transition">
                  {model.releaseDate.split('-')[0].slice(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Model Telemetry Box */}
        <div className="mt-3 p-3 bg-[#0d0d0d] border border-[#1f521f] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold">[{activeModel.id.padStart(2, '0')}]</span>
            <span className="text-white font-bold">{activeModel.model}</span>
            <span className="text-slate-400">LAUNCH: {activeModel.releaseDate}</span>
            <span className="text-slate-400">MSRP: {formatCurrency(activeModel.modelPrice)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500">VALUATION: </span>
              <span className="text-[#33ff00] font-bold">{formatCurrency(activeModel.investedValue)}</span>
            </div>
            <div>
              <span className="text-slate-500">ROI: </span>
              <span className="text-[#33ff00] font-bold">+{formatPercentage(activeModel.roi)}</span>
            </div>
            <button
              onClick={() => onSelectModel(activeModel)}
              className="px-2 py-0.5 text-[11px] font-bold uppercase bg-[#1f521f]/50 hover:bg-[#33ff00] hover:text-black text-[#33ff00] border border-[#1f521f] flex items-center gap-1 transition"
            >
              <span>LOAD IN SIM</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
