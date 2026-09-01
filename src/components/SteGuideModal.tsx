import React from 'react';
import { X, Terminal } from 'lucide-react';

interface SteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SteGuideModal: React.FC<SteGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-in font-mono">
      <div className="terminal-box max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-[#33ff00] shadow-[0_0_25px_rgba(51,255,0,0.2)]">
        {/* Terminal Manual Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f1f0f] border-b border-[#1f521f] text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#33ff00]" />
            <span className="font-bold text-[#33ff00] uppercase tracking-wider">
              MAN(1) MANUAL PAGE // AAPL-MODEL(1)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-[#1f521f] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Manual Page Content (ASD-STE100) */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-300 leading-relaxed font-mono">
          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">NAME</h4>
            <p className="pl-4 text-white">aapl-model — Calculate Apple stock investment returns vs iPhone hardware purchases</p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">SYNOPSIS</h4>
            <p className="pl-4 text-[#33ff00] font-bold">aapl-model [--model=ID] [--amount=USD] [--price=USD] [--realtime]</p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">DESCRIPTION</h4>
            <p className="pl-4 text-slate-300">
              This program calculates the financial return of Apple stock (AAPL). It compares the purchase price of each iPhone model to an equal investment in Apple stock on the release date. All text follows the ASD-STE100 specification.
            </p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">CALCULATION INVARIANTS</h4>
            <div className="pl-4 space-y-1 text-slate-200 bg-[#080808] p-3 border border-[#1f521f]">
              <div>&gt; Shares Acquired  = Model MSRP / Historical AAPL Price</div>
              <div>&gt; Invested Value   = Shares Acquired * Current AAPL Price</div>
              <div>&gt; Net Profit       = Invested Value - Model MSRP</div>
              <div>&gt; Cumulative ROI   = (Invested Value / Model MSRP) - 1.00</div>
            </div>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">STOCK SPLIT ADJUSTMENTS</h4>
            <p className="pl-4 text-slate-300">
              Historical prices use split adjustments. Apple completed two major stock splits during the iPhone timeline:
            </p>
            <div className="pl-6 mt-1 space-y-1 text-slate-400">
              <div>- June 09, 2014: 7-for-1 stock split.</div>
              <div>- August 28, 2020: 4-for-1 stock split.</div>
            </div>
            <p className="pl-4 mt-2 text-slate-300">
              Split adjustments make share quantities and prices mathematically consistent across all 49 rows.
            </p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-1">EXCEL COMPATIBILITY & REAL-TIME SYNC</h4>
            <p className="pl-4 text-slate-300">
              The web interface queries financial market APIs for real-time AAPL prices. The downloadable Excel workbook contains native fallback formulas to ensure offline calculation integrity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0a0a] border-t border-[#1f521f] flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">PAGER: END // PRESS ESC OR CLICK CLOSE</span>
          <button
            onClick={onClose}
            className="terminal-btn px-4 py-1"
          >
            [ CLOSE / QUIT ]
          </button>
        </div>
      </div>
    </div>
  );
};
