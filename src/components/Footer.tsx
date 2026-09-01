import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 mt-16 py-8 bg-apple-dark/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Historical launch data: Apple Inc. Public Records & Yahoo Finance.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Documented in ASD-STE100</span>
          <a
            href="https://github.com/aryankori/apple-stock-vs-iphone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
