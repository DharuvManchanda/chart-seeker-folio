
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockQueryForm } from '../components/forms/StockQueryForm';
import { StockChart } from '../components/charts/StockChart';
import { TimeSeriesTable } from '../components/tables/TimeSeriesTable';
import { MetaDataCard } from '../components/ui/MetaDataCard';
import { useAuthStore } from '../store/authStore';
import { useStockStore } from '../store/stockStore';
import { LogOut, BarChart3, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout, checkAuth } = useAuthStore();
  const { currentData, isLoading, error } = useStockStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Stock Market Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.name || user?.email}
                </span>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Query Form */}
          <StockQueryForm />

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

          {/* Data Display */}
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

          {/* Welcome Message */}
          {!currentData && !isLoading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Your Stock Dashboard
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the form above to query stock data. You can fetch daily or intraday 
                  time series data for any stock symbol and save your favorite queries to your wishlist.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
