export interface IPhone {
  id: string;
  model: string;
  /** First US in-store sale date, YYYY-MM-DD. */
  releaseDate: string;
  /** US launch price of the base storage tier, USD. */
  msrp: number;
  /** Split-adjusted AAPL close on the release date. Reference copy only. */
  launchClose: number;
}

export interface Quote {
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketTime: string;
  marketDay: string;
}

export interface MarketSnapshot {
  symbol: string;
  source: string;
  fetchedAt: string;
  quote: Quote;
  history: {
    dates: string[];
    close: number[];
    adjClose: number[];
  };
}

/** 'price' ignores dividends. 'total' reinvests every dividend in AAPL. */
export type Basis = 'price' | 'total';

export interface Holding extends IPhone {
  /** Index of the purchase day in the price history. */
  buyIndex: number;
  buyDate: string;
  buyPrice: number;
  sharesBought: number;
  /** Shares held today. Larger than sharesBought when dividends are reinvested. */
  sharesNow: number;
  value: number;
  gain: number;
  multiple: number;
  years: number;
  /** Compound annual growth rate. Null when the holding period is under a year. */
  cagr: number | null;
}
