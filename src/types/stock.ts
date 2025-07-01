
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface StockMetaData {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Interval"?: string;
  "5. Output Size": string;
  "6. Time Zone": string;
}

export interface StockDataPoint {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface StockApiResponse {
  "Meta Data": StockMetaData;
  [key: string]: any; // For "Time Series (Daily)" or "Time Series (5min)" etc.
}

export interface ParsedStockData {
  metaData: StockMetaData;
  timeSeries: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface StockQueryOptions {
  function: "TIME_SERIES_DAILY" | "TIME_SERIES_INTRADAY";
  symbol: string;
  interval?: "1min" | "5min" | "15min" | "30min" | "60min";
  adjusted?: boolean;
  extended_hours?: boolean;
  month?: string;
  outputsize?: "compact" | "full";
  datatype?: "json" | "csv";
}

export interface WishlistItem {
  id: number;
  createdAt: string;
  name: string;
  userId: number;
  options: StockQueryOptions;
}
