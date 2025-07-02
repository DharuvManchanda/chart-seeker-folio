
import { create } from 'zustand';
import { StockQueryOptions, StockApiResponse, ParsedStockData } from '../types/stock';
import { apiClient } from '../services/api';
import { parseStockData } from '../utils/stockDataParser';

interface StockState {
  currentData: ParsedStockData | null;
  isLoading: boolean;
  error: string | null;
  fetchStockData: (options: StockQueryOptions) => Promise<ParsedStockData>;
  clearData: () => void;
}

export const useStockStore = create<StockState>((set) => ({
  currentData: null,
  isLoading: false,
  error: null,

  fetchStockData: async (options: StockQueryOptions): Promise<ParsedStockData> => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{ success: boolean; data: StockApiResponse }>('/stock-data', {
        options,
      });

      if (response.success && response.data) {
        const parsedData = parseStockData(response.data);
        set({
          currentData: parsedData,
          isLoading: false,
          error: null,
        });
        return parsedData;
      } else {
        throw new Error('Failed to fetch stock data');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },

  clearData: () => {
    set({ currentData: null, error: null });
  },
}));
