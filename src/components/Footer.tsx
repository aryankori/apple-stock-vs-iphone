import React from 'react';
import { ExternalLink, Heart, Sparkles, UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 mt-16 bg-[#0c0c10] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Acknowledgments & Provenance Card */}
        <div className="apple-card p-6 sm:p-7 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Acknowledgments & Project Provenance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Developer Credit: Aryan Kori */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Engineering & Real-Time Sync
                  </span>
                  <svg className="w-4 h-4 fill-current text-slate-400" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white mt-1">Aryan Kori</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Engineered the real-time financial tracking architecture, split-adjusted formula validation across 49 iPhone models, interactive simulator, and live Vercel deployment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <a
                  href="https://github.com/aryankori"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>github.com/aryankori</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
                <a
                  href="https://github.com/aryankori/apple-stock-vs-iphone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  View Source Repo
                </a>
              </div>
            </div>

            {/* Original Ideation Credit: Outsourced */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Original Ideation
                  </span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">Outsourced</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Special thank you to <strong>Outsourced</strong>, the original ideator who created the foundational spreadsheet years ago. That initial model was updated with current market data and expanded into this live application.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <a
                  href="https://steamcommunity.com/id/Outsourced/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.979 0C5.64 0 .47 4.908.021 11.143l6.532 2.686a3.784 3.784 0 0 1 2.228-.727c.22 0 .436.02.646.058l3.053-4.425a4.78 4.78 0 0 1-.059-.728c0-2.651 2.149-4.8 4.8-4.8 2.652 0 4.8 2.149 4.8 4.8 0 2.652-2.148 4.8-4.8 4.8a4.78 4.78 0 0 1-.806-.068l-4.35 3.093c.026.177.04.358.04.542 0 2.052-1.637 3.72-3.684 3.765l-2.457 3.535C8.01 23.87 9.94 24 11.98 24c6.627 0 12-5.373 12-12S18.607 0 11.979 0zM7.55 17.55a2.138 2.138 0 0 1-2.13-2.13c0-.36.09-.7.25-1l2.42 1a2.135 2.135 0 0 1-.54 2.13zm11.7-8.85a3.15 3.15 0 1 1-6.3 0 3.15 3.15 0 0 1 6.3 0z"/>
                  </svg>
                  <span>steamcommunity.com/id/Outsourced/</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
                <span className="text-[11px] text-slate-500">Original Sheet Creator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Provenance Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span>Historical launch pricing & market data verified via Apple Inc. and Yahoo Finance.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Documented in ASD-STE100</span>
            <span>•</span>
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
      </div>
    </footer>
  );
};
