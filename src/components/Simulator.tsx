import React, { useState } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { Terminal, Cpu, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatorProps {
  models: IPhoneCalculation[];
  selectedModel: IPhoneCalculation;
  onSelectModel: (model: IPhoneCalculation) => void;
  currentStockPrice: number;
  theme?: 'green' | 'amber';
}

export const Simulator: React.FC<SimulatorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  currentStockPrice,
  theme = 'green',
}) => {
  const [customAmount, setCustomAmount] = useState<number>(selectedModel.modelPrice);
  const [customStockPrice, setCustomStockPrice] = useState<number>(currentStockPrice);

  const isGreen = theme === 'green';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const headerBg = isGreen ? 'bg-[#0f1a0f]' : 'bg-[#1a1400]';

  const handleModelChange = (modelId: string) => {
    const found = models.find(m => m.id === modelId);
    if (found) {
      onSelectModel(found);
      setCustomAmount(found.modelPrice);
    }
  };

  const simulatedShares = selectedModel.historicalStockPrice > 0 ? customAmount / selectedModel.historicalStockPrice : 0;
  const simulatedValue = simulatedShares * customStockPrice;
  const simulatedProfit = simulatedValue - customAmount;
  const simulatedRoi = customAmount > 0 ? (simulatedValue / customAmount) - 1 : 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#33ff00', '#ffb000', '#ffffff', '#00d4ff']
    });
  };

  // Generate ASCII Bar representation
  const generateAsciiBar = (val: number, cost: number) => {
    const totalSlots = 30;
    if (val <= 0 || cost <= 0) return '[..............................]';
    const costRatio = Math.min(1, cost / val);
    const costSlots = Math.max(1, Math.round(costRatio * totalSlots));
    const gainSlots = Math.max(0, totalSlots - costSlots);
    return `[${'#'.repeat(costSlots)}${'|'.repeat(gainSlots)}]`;
  };

  return (
    <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor}`}>
      {/* Pane Header */}
      <div className={`flex flex-wrap items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-xs font-mono`}>
        <div className="flex items-center gap-2">
          <Cpu className={`w-3.5 h-3.5 ${primaryText}`} />
          <span className={`font-bold uppercase tracking-wider ${primaryText}`}>
            +-- SIMULATOR // CAPITAL ALLOCATION ENGINE --+
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">MATH_INVARIANT: V_t = (P_0 / S_0) * S_t</span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1f521f]/50 text-[#33ff00]">
            [ENGINE:ACTIVE]
          </span>
        </div>
      </div>

      {/* Pane Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Preset Target Stock Price Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1f521f]/50 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-[#33ff00]" />
            <span>SELECT $AAPL TARGET SCENARIO:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[300, 325, 350, 400, 500].map(price => (
              <button
                key={price}
                onClick={() => {
                  setCustomStockPrice(price);
                  if (price >= 400) triggerCelebration();
                }}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition ${
                  customStockPrice === price
                    ? 'bg-[#33ff00] text-black'
                    : 'border border-[#1f521f] text-slate-300 hover:bg-[#1f521f]/40 hover:text-white'
                }`}
              >
                [ ${price}.00 ]
              </button>
            ))}
            <button
              onClick={() => setCustomStockPrice(currentStockPrice)}
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase border border-[#33ff00] text-[#33ff00] hover:bg-[#33ff00] hover:text-black transition"
            >
              [ LIVE: ${currentStockPrice.toFixed(2)} ]
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4 font-mono">
            {/* Model Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                // 01. TARGET IPHONE HARDWARE MODEL
              </label>
              <select
                value={selectedModel.id}
                onChange={(e) => handleModelChange(e.target.value)}
                aria-label="Target iPhone Model"
                className="w-full bg-[#0a0a0a] border border-[#1f521f] text-white text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#33ff00] transition"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#0a0a0a] text-white font-mono">
                    [{m.id.padStart(2, '0')}] {m.model} ({m.releaseDate.split('-')[0]}) — MSRP: ${m.modelPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* Launch Telemetry */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-[#080808] border border-[#1f521f] text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">LAUNCH DATE:</span>
                <span className="text-white font-bold">{selectedModel.releaseDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">SPLIT-ADJ AAPL:</span>
                <span className="text-[#33ff00] font-bold">${selectedModel.historicalStockPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Capital Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label className="font-bold text-slate-300 uppercase">
                  // 02. CAPITAL ALLOCATION ($ USD)
                </label>
                <button
                  onClick={() => setCustomAmount(selectedModel.modelPrice)}
                  className="text-[11px] text-[#33ff00] underline hover:text-white transition"
                >
                  [ RESET: ${selectedModel.modelPrice} ]
                </button>
              </div>
              <div className="flex items-center border border-[#1f521f] bg-[#0a0a0a] px-3 py-1.5">
                <span className="text-slate-500 font-bold mr-2">$</span>
                <input
                  type="number"
                  min={1}
                  max={1000000}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full bg-transparent text-white font-mono text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Target Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-bold text-slate-300 uppercase">
                  // 03. AAPL PRICE TARGET SLIDER
                </label>
                <span className="text-[#33ff00] font-bold">${customStockPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={600}
                step={1}
                value={customStockPrice}
                onChange={(e) => setCustomStockPrice(Number(e.target.value))}
                className="w-full accent-[#33ff00] h-1.5 bg-[#152515] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$50.00</span>
                <span>$300.00</span>
                <span>$600.00</span>
              </div>
            </div>
          </div>

          {/* Telemetry Output Column */}
          <div className="lg:col-span-7 bg-[#080808] border border-[#1f521f] p-4 sm:p-5 flex flex-col justify-between font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1f521f] text-xs">
                <span className="font-bold text-[#33ff00] flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-[#33ff00] fill-current" />
                  <span>SIMULATION EXECUTION TELEMETRY</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedModel.model} @ ${customStockPrice.toFixed(2)}
                </span>
              </div>

              {/* 3 Metric Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                <div className="p-3 bg-[#0d0d0d] border border-[#1f521f]">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">SHARES ACQUIRED</span>
                  <div className="text-lg font-black text-white mt-1">
                    {simulatedShares.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">units @ ${selectedModel.historicalStockPrice.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-[#0d0d0d] border border-[#1f521f]">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">PORTFOLIO VALUATION</span>
                  <div className="text-lg font-black text-[#33ff00] mt-1 terminal-glow">
                    {formatCurrency(simulatedValue)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">at ${customStockPrice.toFixed(2)}/share</span>
                </div>

                <div className="p-3 bg-[#0d0d0d] border border-[#1f521f]">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">NET PROFIT & ROI</span>
                  <div className="text-lg font-black text-white mt-1">
                    +{formatPercentage(simulatedRoi)}
                  </div>
                  <span className="text-[10px] text-[#33ff00] mt-0.5 block">+{formatCurrency(simulatedProfit)}</span>
                </div>
              </div>

              {/* ASCII Visualization */}
              <div className="mt-4 p-3 bg-[#050505] border border-[#1f521f]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-bold">CAPITAL RATIO VISUALIZER:</span>
                  <span className="text-[#33ff00] font-bold">
                    {(simulatedValue / (customAmount || 1)).toFixed(2)}x MULTIPLE
                  </span>
                </div>
                <div className="text-xs text-[#33ff00] font-mono tracking-widest overflow-x-auto whitespace-nowrap">
                  {generateAsciiBar(simulatedValue, customAmount)}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span>[#] HARDWARE MSRP: {formatCurrency(customAmount)}</span>
                  <span>[|] STOCK ALPHA: +{formatCurrency(simulatedProfit)}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-[#1f521f]">
              &gt; Hardware residual value today: ~$0.00 // Stock equity value: {formatCurrency(simulatedValue)}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
