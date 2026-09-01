import { IPhoneRawData, IPhoneCalculation, PortfolioSummary } from '../types';

export function calculateModelMetrics(raw: IPhoneRawData, currentStockPrice: number): IPhoneCalculation {
  const sharesPurchased = raw.modelPrice / raw.historicalStockPrice;
  const investedValue = sharesPurchased * currentStockPrice;
  const profit = investedValue - raw.modelPrice;
  const roi = (investedValue / raw.modelPrice) - 1;

  return {
    ...raw,
    currentStockPrice,
    sharesPurchased,
    investedValue,
    profit,
    roi,
  };
}

export function calculateAllModels(dataset: IPhoneRawData[], currentStockPrice: number): IPhoneCalculation[] {
  return dataset.map(item => calculateModelMetrics(item, currentStockPrice));
}

export function calculatePortfolioSummary(calculations: IPhoneCalculation[]): PortfolioSummary {
  const totalCost = calculations.reduce((sum, item) => sum + item.modelPrice, 0);
  const totalInvestedValue = calculations.reduce((sum, item) => sum + item.investedValue, 0);
  const totalProfit = calculations.reduce((sum, item) => sum + item.profit, 0);
  const totalShares = calculations.reduce((sum, item) => sum + item.sharesPurchased, 0);
  const overallRoi = totalCost > 0 ? (totalInvestedValue / totalCost) - 1 : 0;

  // Best and worst performers by ROI
  const sortedByRoi = [...calculations].sort((a, b) => b.roi - a.roi);
  const bestPerformer = sortedByRoi[0];
  const worstPerformer = sortedByRoi[sortedByRoi.length - 1];

  return {
    totalCost,
    totalInvestedValue,
    totalProfit,
    overallRoi,
    totalShares,
    bestPerformer,
    worstPerformer,
  };
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}
