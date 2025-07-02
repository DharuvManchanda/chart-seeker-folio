
import { toast } from 'sonner';
import { StockQueryOptions } from '../../../types/stock';
import { useStockStore } from '../../../store/stockStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { StockQueryFormData } from '../schemas/stockQuerySchema';

export const useStockQueryForm = (onQuerySuccess?: () => void) => {
  const { fetchStockData, isLoading: isLoadingStock } = useStockStore();
  const { saveToWishlist, isLoading: isLoadingWishlist } = useWishlistStore();

  const onSubmit = async (data: StockQueryFormData) => {
    try {
      const options: StockQueryOptions = {
        function: data.function,
        symbol: data.symbol,
        outputsize: data.outputsize,
        datatype: data.datatype,
      };
       
      if (data.function === 'TIME_SERIES_INTRADAY') {
        options.interval = data.interval;
        options.adjusted = data.adjusted;
        options.extended_hours = data.extended_hours;
        if (data.month) {
          options.month = data.month;
        }
      }

      await fetchStockData(options);
      toast.success('Stock data fetched successfully!');
      onQuerySuccess?.();
    } catch (error) {
      toast.error('Failed to fetch stock data');
    }
  };

  const handleOpenWishlistDialog = () => {
    const currentData = useStockStore.getState().currentData;

    if (!currentData) {
      toast.error('No stock data available to save.');
      return false;
    }

    const symbol = currentData.metaData["2. Symbol"];

    if (!symbol) {
      toast.error('Stock symbol is missing.');
      return false;
    }

    return true;
  };

  const handleSaveToWishlist = async (wishlistName: string, getValues: () => StockQueryFormData) => {
    const currentData = useStockStore.getState().currentData;
    
    if (!currentData) {
      toast.error('No stock data available to save.');
      return;
    }

    const symbol = currentData.metaData["2. Symbol"];

    if (!symbol) {
      toast.error('Stock symbol is missing.');
      return;
    }
    
    const data = getValues();

    try {
      const options: StockQueryOptions = {
        function: data.function,
        symbol: symbol,
        outputsize: data.outputsize,
        datatype: data.datatype,
      };

      if (data.function === 'TIME_SERIES_INTRADAY') {
        options.interval = data.interval;
        options.adjusted = data.adjusted;
        options.extended_hours = data.extended_hours;
        if (data.month) {
          options.month = data.month;
        }
      }

      await saveToWishlist(wishlistName, options);
      toast.success('Query saved to wishlist!');
    } catch (error) {
      toast.error('Failed to save to wishlist');
    }
  };

  return {
    onSubmit,
    handleOpenWishlistDialog,
    handleSaveToWishlist,
    isLoadingStock,
    isLoadingWishlist,
  };
};
