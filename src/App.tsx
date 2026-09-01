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
  const [selectedModelId, setSelectedModelId] = useState<string>('1'); // Default: iPhone 3G
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

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
    // Auto refresh every 60 seconds
    const interval = setInterval(loadStockPrice, 60000);
    return () => clearInterval(interval);
  }, [loadStockPrice]);

  // Recalculate all 49 iPhone models dynamically when current AAPL price changes
  const calculatedModels = useMemo(() => {
    return calculateAllModels(IPHONE_DATASET, quote.price);
  }, [quote.price]);

  // Recalculate portfolio summary
  const summary = useMemo(() => {
    return calculatePortfolioSummary(calculatedModels);
  }, [calculatedModels]);

  // Active selected model for simulator
  const selectedModel = useMemo(() => {
    return calculatedModels.find(m => m.id === selectedModelId) || calculatedModels[0];
  }, [calculatedModels, selectedModelId]);

  const handleSelectModel = (model: IPhoneCalculation) => {
    setSelectedModelId(model.id);
    // Smooth scroll to simulator on small screens
    const simElem = document.getElementById('simulator-section');
    if (simElem && window.innerWidth < 768) {
      simElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080b] flex flex-col">
      {/* Header with Live Ticker */}
      <Header
        quote={quote}
        isLoading={isLoading}
        onRefresh={loadStockPrice}
        onOpenGuide={() => setIsGuideOpen(true)}
        lastRefreshed={lastRefreshed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
            <span>Hardware vs Capital Allocation Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What if you invested in <span className="shimmer-text">Apple Stock</span> instead of buying every iPhone?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            This live dashboard calculates the current value of investing the retail launch price of each iPhone model into Apple stock ($AAPL) on its exact release date.
          </p>
        </div>

        {/* Aggregate KPI Summary Cards */}
        <section aria-label="Portfolio Summary">
          <KpiCards summary={summary} />
        </section>

        {/* Simulator Section */}
        <section id="simulator-section" aria-label="Interactive Simulator">
          <Simulator
            models={calculatedModels}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            currentStockPrice={quote.price}
          />
        </section>

        {/* Visual ROI Timeline Chart */}
        <section aria-label="Timeline and Return Chart">
          <RoiChart
            models={calculatedModels}
            onSelectModel={handleSelectModel}
            selectedModelId={selectedModelId}
          />
        </section>

        {/* Complete iPhone Analysis Table */}
        <section aria-label="Complete iPhone Ledger">
          <IPhoneTable
            models={calculatedModels}
            onSelectModel={handleSelectModel}
            selectedModelId={selectedModelId}
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
