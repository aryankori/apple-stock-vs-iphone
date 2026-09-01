import React from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1f521f] mt-12 py-6 bg-[#070707] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#33ff00]" />
          <span>AAPL_MAINFRAME // Historical data verified via Apple Inc. & Yahoo Finance.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">[ASD-STE100 CERTIFIED]</span>
          <a
            href="https://github.com/aryankori/apple-stock-vs-iphone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#33ff00] hover:underline flex items-center gap-1 transition"
          >
            <span>[ GIT REPO ]</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
