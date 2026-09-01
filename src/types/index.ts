export interface IPhoneRawData {
  id: string;
  model: string;
  releaseDate: string;
  modelPrice: number;
  historicalStockPrice: number;
  generation: string;
}

export interface IPhoneCalculation extends IPhoneRawData {
  currentStockPrice: number;
  sharesPurchased: number;
  investedValue: number;
  profit: number;
  roi: number; // decimal, e.g. 73.67 for 7367%
}

export interface PortfolioSummary {
  totalCost: number;
  totalInvestedValue: number;
  totalProfit: number;
  overallRoi: number;
  totalShares: number;
  bestPerformer: IPhoneCalculation;
  worstPerformer: IPhoneCalculation;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
  currency: string;
  isRealTime: boolean;
}
