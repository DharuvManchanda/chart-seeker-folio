import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useStockStore } from '../store/stockStore';
import { StockChart } from '@/components/charts/StockChart';
import { TimeSeriesTable } from '@/components/tables/TimeSeriesTable';
import { MetaDataCard } from '@/components/ui/MetaDataCard';
import { User, Heart, Trash2, Play } from 'lucide-react';
import { parseStockData } from '../utils/stockDataParser';

export const WishList: React.FC = () => {
  const { user } = useAuthStore();
  const { items, removeFromWishlist, executeWishlistItem, fetchWishlistItems } = useWishlistStore();
  const { currentData, isLoading, error, clearData } = useStockStore();
  
  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
    // Clear any existing stock data when component mounts
    clearData();
  }, [fetchWishlistItems, clearData, user]);

  console.log('WishList items state:', items);

  const handleExecuteWishlist = async (name: string) => {
    try {
      clearData();
      const response = await executeWishlistItem(name);
      console.log('Executed wishlist item response:', response);

      if (response.data.success && response.data.data) {
        // Parse the nested response structure
        const parsedData = parseStockData(response.data.data);
        // Update the stock store directly
        useStockStore.setState({ 
          currentData: parsedData, 
          isLoading: false, 
          error: null 
        });
        console.log('Parsed and set stock data:', parsedData);
      } else {
        console.error('Execution failed:', response.data.message);
        useStockStore.setState({ 
          error: response.data.message || 'Failed to execute wishlist item',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Failed to execute wishlist item:', error);
      useStockStore.setState({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  };

  const handleRemoveFromWishlist = async (name: string) => {
    try {
      await removeFromWishlist(name);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Wishlist Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="h-6 w-6" />
                My Wishlist ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No items in your wishlist yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Save stock queries from the dashboard to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
                          <p className="mt-1">
                            <span className="font-medium">Symbol: {item.options.symbol || 'N/A'}</span>
                            <span className="mx-2">•</span>
                            <span>Function: {item.options.function}</span>
                            {item.options.interval && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Interval: {item.options.interval}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExecuteWishlist(item.name)}
                          className="flex items-center gap-2"
                          disabled={isLoading}
                        >
                          <Play className="h-4 w-4" />
                          {isLoading ? 'Loading...' : 'Execute'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(item.name)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Fetching stock data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Stock Data Display */}
          {currentData && !isLoading && (
            <div className="space-y-6">
              {/* Meta Data */}
              <MetaDataCard metaData={currentData.metaData} />
              
              {/* Chart */}
              <StockChart data={currentData} />
              
              {/* Table */}
              <TimeSeriesTable data={currentData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
