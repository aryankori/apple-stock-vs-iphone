import { useState, useEffect, useMemo, useCallback } from 'react';
import { IPHONE_DATASET } from './data/iphoneData';
import { fetchAaplStockQuote } from './services/stockApi';
import { calculateAllModels, calculatePortfolioSummary } from './utils/calculator';
import { StockQuote, IPhoneCalculation } from './types';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { Simulator } from './components/Simulator';
import { RoiChart } from './components/RoiChart';
import { IPhoneTable } from './components/IPhoneTable';
import { SteGuideModal } from './components/SteGuideModal';
import { TerminalPrompt } from './components/TerminalPrompt';
import { CrtOverlay } from './components/CrtOverlay';
import { Footer } from './components/Footer';

export function App() {
  const [quote, setQuote] = useState<StockQuote>({
    symbol: 'AAPL',
    price: 325.70,
    change: 0.88,
    changePercent: 0.27,
    timestamp: new Date().toISOString(),
    currency: 'USD',
    isRealTime: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedModelId, setSelectedModelId] = useState<string>('1'); // iPhone 3G
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'green' | 'amber'>('green');

  const loadStockPrice = useCallback(async () => {
    setIsLoading(true);
    try {
      const newQuote = await fetchAaplStockQuote();
      setQuote(newQuote);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to refresh stock quote', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockPrice();
    const interval = setInterval(loadStockPrice, 60000);
    return () => clearInterval(interval);
  }, [loadStockPrice]);

  const calculatedModels = useMemo(() => {
    return calculateAllModels(IPHONE_DATASET, quote.price);
  }, [quote.price]);

  const summary = useMemo(() => {
    return calculatePortfolioSummary(calculatedModels);
  }, [calculatedModels]);

  const selectedModel = useMemo(() => {
    return calculatedModels.find(m => m.id === selectedModelId) || calculatedModels[0];
  }, [calculatedModels, selectedModelId]);

  const handleSelectModel = (model: IPhoneCalculation) => {
    setSelectedModelId(model.id);
    const simElem = document.getElementById('simulator-section');
    if (simElem && window.innerWidth < 768) {
      simElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isGreen = theme === 'green';
  const primaryText = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';

  return (
    <div className={`min-h-screen bg-[#0a0a0a] ${isGreen ? 'text-[#33ff00]' : 'text-[#ffb000]'} flex flex-col font-mono relative`}>
      {/* CRT Scanline Overlay */}
      <CrtOverlay enabled={crtEnabled} />

      {/* Header */}
      <Header
        quote={quote}
        isLoading={isLoading}
        onRefresh={loadStockPrice}
        onOpenGuide={() => setIsGuideOpen(true)}
        lastRefreshed={lastRefreshed}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'green' ? 'amber' : 'green')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ASCII Banner & System Hero */}
        <div className={`terminal-box border ${borderColor} p-4 sm:p-5 bg-[#080808]`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#33ff00] text-black">
                  ROOT@MAINFRAME
                </span>
                <span className="text-xs text-slate-400 font-mono">/dev/apple/portfolio_eval</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${primaryText}`}>
                &gt; CAPITAL INVESTMENT VS HARDWARE EXPENDITURE MODEL
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                This system evaluates real-time market value if you invested the retail launch cost of every iPhone (from 2007 to 2026) into Apple Inc. ($AAPL) equity instead of purchasing the device.
              </p>
            </div>

            <div className="hidden sm:block text-right text-[11px] text-slate-500 font-mono">
              <div>DATASET: 49 CANONICAL RELEASES</div>
              <div>SPLIT ADJUSTMENTS: 7:1 (2014) / 4:1 (2020)</div>
              <div>POLLING: 60s INTERVAL (YAHOO FINANCE API)</div>
            </div>
          </div>
        </div>

        {/* Interactive Shell CLI Bar */}
        <section aria-label="Terminal Command Prompt">
          <TerminalPrompt
            models={calculatedModels}
            onSelectModel={handleSelectModel}
            onRefreshStock={loadStockPrice}
            onOpenGuide={() => setIsGuideOpen(true)}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            crtEnabled={crtEnabled}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'green' ? 'amber' : 'green')}
          />
        </section>

        {/* Aggregate KPI System Panes */}
        <section aria-label="System Metrics">
          <KpiCards summary={summary} theme={theme} />
        </section>

        {/* Simulator Core Section */}
        <section id="simulator-section" aria-label="Simulation Core">
          <Simulator
            models={calculatedModels}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            currentStockPrice={quote.price}
            theme={theme}
          />
        </section>

        {/* Timeline Histogram Chart */}
        <section aria-label="Timeline Histogram">
          <RoiChart
            models={calculatedModels}
            onSelectModel={handleSelectModel}
            selectedModelId={selectedModelId}
            theme={theme}
          />
        </section>

        {/* Complete Database Ledger Table */}
        <section aria-label="Complete iPhone Ledger">
          <IPhoneTable
            models={calculatedModels}
            onSelectModel={handleSelectModel}
            selectedModelId={selectedModelId}
            theme={theme}
          />
        </section>
      </main>

      {/* Technical Documentation Modal (ASD-STE100) */}
      <SteGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
