import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StockQueryOptions } from '../../types/stock';
import { useStockStore } from '../../store/stockStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { WishlistDialog } from '../dialogs/WishlistDialog';
import { toast } from 'sonner';
import { TrendingUp, Heart } from 'lucide-react';

const stockQuerySchema = z.object({
  function: z.enum(['TIME_SERIES_DAILY', 'TIME_SERIES_INTRADAY']),
  symbol: z.string().min(1, 'Stock symbol is required').toUpperCase(),
  interval: z.enum(['1min', '5min', '15min', '30min', '60min']).optional(),
  adjusted: z.boolean().default(true),
  extended_hours: z.boolean().default(true),
  month: z.string().optional(),
  outputsize: z.enum(['compact', 'full']).default('compact'),
  datatype: z.enum(['json', 'csv']).default('json'),
}).refine((data) => {
  if (data.function === 'TIME_SERIES_INTRADAY' && !data.interval) {
    return false;
  }
  return true;
}, {
  message: "Interval is required for intraday data",
  path: ["interval"],
});

type StockQueryFormData = z.infer<typeof stockQuerySchema>;

interface StockQueryFormProps {
  onQuerySuccess?: () => void;
}

export const StockQueryForm: React.FC<StockQueryFormProps> = ({ onQuerySuccess }) => {
  const { fetchStockData, isLoading: isLoadingStock } = useStockStore();
  const { saveToWishlist, isLoading: isLoadingWishlist } = useWishlistStore();
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm<StockQueryFormData>({
    resolver: zodResolver(stockQuerySchema),
    defaultValues: {
      function: 'TIME_SERIES_DAILY',
      adjusted: true,
      extended_hours: true,
      outputsize: 'compact',
      datatype: 'json',
    },
  });

  const functionType = watch('function');

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
      return;
    }

    const symbol = currentData.metaData["2. Symbol"];

    if (!symbol) {
      toast.error('Stock symbol is missing.');
      return;
    }

    setWishlistDialogOpen(true);
  };

  const handleSaveToWishlist = async (wishlistName: string) => {
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

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stock Data Query
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Function Type */}
            <div>
              <Label className="text-base font-medium">Function Type</Label>
              <Controller
                name="function"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TIME_SERIES_DAILY" id="daily" />
                      <Label htmlFor="daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TIME_SERIES_INTRADAY" id="intraday" />
                      <Label htmlFor="intraday">Intraday</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Stock Symbol */}
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                {...register('symbol')}
                id="symbol"
                placeholder="Enter stock symbol (e.g., IBM, AAPL)"
                className="mt-1"
              />
              {errors.symbol && (
                <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>
              )}
            </div>

            {/* Intraday-specific fields */}
            {functionType === 'TIME_SERIES_INTRADAY' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Intraday Options</h4>
                
                {/* Interval */}
                <div>
                  <Label htmlFor="interval">Interval</Label>
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1min">1 minute</SelectItem>
                          <SelectItem value="5min">5 minutes</SelectItem>
                          <SelectItem value="15min">15 minutes</SelectItem>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="60min">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.interval && (
                    <p className="text-red-500 text-sm mt-1">{errors.interval.message}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <Controller
                    name="adjusted"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="adjusted"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="adjusted">Adjusted Data</Label>
                      </div>
                    )}
                  />

                  <Controller
                    name="extended_hours"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="extended_hours"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="extended_hours">Extended Hours</Label>
                      </div>
                    )}
                  />
                </div>

                {/* Month */}
                <div>
                  <Label htmlFor="month">Month (Optional)</Label>
                  <Input
                    {...register('month')}
                    id="month"
                    type="month"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Output Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Output Size</Label>
                <Controller
                  name="outputsize"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="compact" />
                        <Label htmlFor="compact">Compact (100 points)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">Full</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Data Type</Label>
                <Controller
                  name="datatype"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="json" id="json" />
                        <Label htmlFor="json">JSON</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="csv" id="csv" />
                        <Label htmlFor="csv">CSV</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoadingStock}
                className="flex-1"
              >
                {isLoadingStock ? 'Fetching...' : 'Get Stock Data'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenWishlistDialog}
                disabled={isLoadingWishlist || !useStockStore.getState().currentData}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                {isLoadingWishlist ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <WishlistDialog
        open={wishlistDialogOpen}
        onOpenChange={setWishlistDialogOpen}
        onSave={handleSaveToWishlist}
        isLoading={isLoadingWishlist}
      />
    </>
  );
};
