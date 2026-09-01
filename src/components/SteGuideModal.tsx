import React from 'react';
import { X, CheckCircle2, FileSpreadsheet, ShieldAlert, Cpu } from 'lucide-react';

interface SteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SteGuideModal: React.FC<SteGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="apple-card max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Technical Guide (ASD-STE100)</h3>
              <p className="text-xs text-slate-400">Simplified Technical English Documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {/* Section 1: Purpose */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              1. Purpose of the System
            </h4>
            <p className="text-slate-300">
              This system calculates the financial return of Apple stock (AAPL). It compares the purchase price of each iPhone model to an equal investment in Apple stock on the release date.
            </p>
          </div>

          {/* Section 2: Mathematical Equations */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              2. Calculation Equations
            </h4>
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-slate-200 space-y-2">
              <div><span className="text-slate-400">Shares Acquired</span> = Model MSRP / Historical AAPL Price</div>
              <div><span className="text-blue-400">Invested Value</span> = Shares Acquired × Current AAPL Price</div>
              <div><span className="text-emerald-400">Net Dollar Profit</span> = Invested Value - Model MSRP</div>
              <div><span className="text-purple-400">Return on Investment (ROI)</span> = (Invested Value / Model MSRP) - 1</div>
            </div>
          </div>

          {/* Section 3: Stock Split Adjustments */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Stock Split Adjustments
            </h4>
            <p className="text-slate-300">
              Historical prices use split adjustments. Apple completed two major stock splits during the iPhone timeline:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>A 7-for-1 stock split occurred on June 9, 2014.</li>
              <li>A 4-for-1 stock split occurred on August 28, 2020.</li>
            </ul>
            <p className="mt-2 text-slate-300">
              Split adjustments make share quantities and prices mathematically consistent across all years.
            </p>
          </div>

          {/* Section 4: Data Feeds & Real-Time Sync */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              4. Real-Time Data and Excel Compatibility
            </h4>
            <p className="text-slate-300">
              The web interface queries financial market APIs for real-time AAPL prices. If the user downloads the Excel workbook, the file contains compatibility formulas with verified offline fallback values.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
