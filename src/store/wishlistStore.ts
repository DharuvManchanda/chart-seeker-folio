
import { create } from 'zustand';
import { WishlistItem, StockQueryOptions, ApiResponse } from '../types/stock';
import { apiClient } from '../services/api';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  saveToWishlist: (name: string, options: StockQueryOptions) => Promise<void>;
  removeFromWishlist: (name: string) => Promise<void>;
  executeWishlistItem: (name: string) => Promise<any>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  saveToWishlist: async (name: string, options: StockQueryOptions) => {
    set({ isLoading: true });
    try {
      const response: ApiResponse = await apiClient.post('/wishlist/save', {
        name,
        options,
      });

      if (response.success) {
        const newItem: WishlistItem = { name, options };
        set((state) => ({
          items: [...state.items.filter(item => item.name !== name), newItem],
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to save to wishlist');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeFromWishlist: async (name: string) => {
    try {
      const response: ApiResponse = await apiClient.delete(`/wishlist/${name}`);
      
      if (response.success) {
        set((state) => ({
          items: state.items.filter(item => item.name !== name),
        }));
      } else {
        throw new Error(response.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      throw error;
    }
  },

  executeWishlistItem: async (name: string) => {
    try {
      const response = await apiClient.get(`/wishlist/${name}/data`);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
