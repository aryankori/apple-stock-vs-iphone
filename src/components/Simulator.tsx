import React, { useState } from 'react';
import { IPhoneCalculation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculator';
import { Calculator, Sparkles, DollarSign, Calendar, TrendingUp, Layers, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatorProps {
  models: IPhoneCalculation[];
  selectedModel: IPhoneCalculation;
  onSelectModel: (model: IPhoneCalculation) => void;
  currentStockPrice: number;
}

export const Simulator: React.FC<SimulatorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  currentStockPrice,
}) => {
  const [customAmount, setCustomAmount] = useState<number>(selectedModel.modelPrice);
  const [customStockPrice, setCustomStockPrice] = useState<number>(currentStockPrice);

  // Sync custom amount when selectedModel changes
  const handleModelChange = (modelId: string) => {
    const found = models.find(m => m.id === modelId);
    if (found) {
      onSelectModel(found);
      setCustomAmount(found.modelPrice);
    }
  };

  // Calculations based on custom inputs
  const simulatedShares = selectedModel.historicalStockPrice > 0 ? customAmount / selectedModel.historicalStockPrice : 0;
  const simulatedValue = simulatedShares * customStockPrice;
  const simulatedProfit = simulatedValue - customAmount;
  const simulatedRoi = customAmount > 0 ? (simulatedValue / customAmount) - 1 : 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0071e3', '#10b981', '#6366f1', '#f59e0b']
    });
  };

  return (
    <div className="apple-card p-6 sm:p-7 rounded-3xl relative overflow-hidden border border-white/10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Investment Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate the exact return for any iPhone model or custom investment amount.
          </p>
        </div>

        {/* Preset quick target prices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Simulate AAPL Price:</span>
          {[300, 325, 350, 400, 500].map(price => (
            <button
              key={price}
              onClick={() => {
                setCustomStockPrice(price);
                if (price >= 400) triggerCelebration();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                customStockPrice === price
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
              }`}
            >
              ${price}
            </button>
          ))}
          <button
            onClick={() => setCustomStockPrice(currentStockPrice)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition border border-emerald-500/30"
          >
            Live (${currentStockPrice.toFixed(2)})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Select iPhone Model */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select iPhone Model
            </label>
            <select
              value={selectedModel.id}
              onChange={(e) => handleModelChange(e.target.value)}
              aria-label="Select iPhone Model"
              className="w-full bg-[#16161d] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition"
            >
              {models.map(m => (
                <option key={m.id} value={m.id} className="bg-[#16161d] text-white">
                  {m.model} ({m.releaseDate.split('-')[0]}) — MSRP: ${m.modelPrice}
                </option>
              ))}
            </select>
          </div>

          {/* Model Launch Details */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
            <div>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Launch Date
              </span>
              <p className="font-semibold text-slate-200 mt-0.5">{selectedModel.releaseDate}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Split-Adjusted AAPL Price
              </span>
              <p className="font-semibold text-slate-200 mt-0.5">${selectedModel.historicalStockPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Custom Investment Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Investment Capital
              </label>
              <button
                onClick={() => setCustomAmount(selectedModel.modelPrice)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition underline"
              >
                Reset to MSRP (${selectedModel.modelPrice})
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                $
              </div>
              <input
                type="number"
                min={1}
                max={1000000}
                value={customAmount}
                onChange={(e) => setCustomAmount(Math.max(1, Number(e.target.value) || 0))}
                className="w-full bg-[#16161d] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Custom AAPL Target Price Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                AAPL Target Price
              </label>
              <span className="text-xs font-bold text-blue-400">${customStockPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={50}
              max={600}
              step={1}
              value={customStockPrice}
              onChange={(e) => setCustomStockPrice(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-blue-950/30 via-slate-900/60 to-purple-950/20 border border-blue-500/20 rounded-2xl p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Simulation Outcome
              </span>
              <span className="text-xs text-slate-400">
                Formula: (Capital / Launch Stock Price) × Target Price
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shares Bought</span>
                <div className="text-xl font-bold text-white mt-1 flex items-center gap-1">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>{simulatedShares.toFixed(2)}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">at ${selectedModel.historicalStockPrice.toFixed(2)}/share</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Portfolio Value</span>
                <div className="text-xl font-bold text-blue-400 mt-1">
                  {formatCurrency(simulatedValue)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">at ${customStockPrice.toFixed(2)}/share</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Net Return (ROI)</span>
                <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{formatPercentage(simulatedRoi)}</span>
                </div>
                <span className="text-[10px] text-emerald-500/80 mt-1 block">+{formatCurrency(simulatedProfit)} gain</span>
              </div>
            </div>

            {/* Comparison Visualizer */}
            <div className="mt-5 p-4 rounded-xl bg-black/50 border border-white/5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-400">Hardware vs Stock Value</span>
                <span className="text-blue-400 font-bold">{(simulatedValue / (customAmount || 1)).toFixed(1)}x Growth</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-slate-600"
                  style={{ width: `${Math.min(100, (customAmount / simulatedValue) * 100)}%` }}
                  title="Original Hardware Cost"
                />
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.max(0, 100 - (customAmount / simulatedValue) * 100)}%` }}
                  title="Stock Capital Gain"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
                  Hardware Cost: {formatCurrency(customAmount)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Stock Gain: +{formatCurrency(simulatedProfit)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5 pt-3 border-t border-white/5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>If you kept the phone, hardware residual value today is near $0. The stock investment holds {formatCurrency(simulatedValue)}.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
