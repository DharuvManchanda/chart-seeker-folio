
import { create } from 'zustand';
import { WishlistItem, StockQueryOptions, ApiResponse } from '../types/stock';
import { apiClient } from '../services/api';
import { useAuthStore } from './authStore';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  saveToWishlist: (name: string, options: StockQueryOptions) => Promise<void>;
  removeFromWishlist: (name: string) => Promise<void>;
  executeWishlistItem: (name: string) => Promise<any>;
  fetchWishlistItems: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  saveToWishlist: async (name: string, options: StockQueryOptions) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();      
      const response: ApiResponse = await apiClient.post('/wishlist/save', {
        name,
        options,
        userId: user?.id,
      });
      console.log("response from saving wishlist",response,options,name);
      
      if (response.data.success) {
        const newItem: WishlistItem = response.data.wishlistItem;
        set((state) => ({
          items: [...state.items.filter(item => item.name !== newItem.name), newItem],
          isLoading: false,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to save to wishlist');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeFromWishlist: async (name: string) => {
    try {
      const response: ApiResponse = await apiClient.delete(`/wishlist/${name}`);
      
      if (response.data.success) {
        set((state) => ({
          items: state.items.filter(item => item.name !== name),
        }));
      } else {
        throw new Error(response.data.message || 'Failed to remove from wishlist');
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

  fetchWishlistItems: async () => {
    try {
      const { user } = useAuthStore.getState();
      console.log("user",user);
      
      const response: ApiResponse<{ wishlist: WishlistItem[] }> = await apiClient.get(`/wishlist?userId=${user.id}`);

      // Assuming the API directly returns the array of items
      console.log("response from wishlist",response)
      set({ items: response.data?.wishlist });
      console.log("Items from wishlist:", response);
    } catch (error) {
      console.error('Failed to fetch wishlist items:', error);
      // Optionally handle the error in the UI
    }
  },
}));
