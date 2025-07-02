
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStockStore } from '../../store/stockStore';
import { WishlistDialog } from '../dialogs/WishlistDialog';
import { TrendingUp, Heart } from 'lucide-react';
import { stockQuerySchema, StockQueryFormData } from './schemas/stockQuerySchema';
import { useStockQueryForm } from './hooks/useStockQueryForm';
import { FunctionTypeSelector } from './components/FunctionTypeSelector';
import { IntradayOptions } from './components/IntradayOptions';
import { OutputOptions } from './components/OutputOptions';

interface StockQueryFormProps {
  onQuerySuccess?: () => void;
}

export const StockQueryForm: React.FC<StockQueryFormProps> = ({ onQuerySuccess }) => {
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

  const {
    onSubmit,
    handleOpenWishlistDialog,
    handleSaveToWishlist,
    isLoadingStock,
    isLoadingWishlist,
  } = useStockQueryForm(onQuerySuccess);

  const functionType = watch('function');

  const handleWishlistClick = () => {
    if (handleOpenWishlistDialog()) {
      setWishlistDialogOpen(true);
    }
  };

  const handleWishlistSave = (wishlistName: string) => {
    handleSaveToWishlist(wishlistName, getValues);
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
            <FunctionTypeSelector control={control} />

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
              <IntradayOptions control={control} register={register} errors={errors} />
            )}

            <OutputOptions control={control} />

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
                onClick={handleWishlistClick}
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
        onSave={handleWishlistSave}
        isLoading={isLoadingWishlist}
      />
    </>
  );
};
