
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockMetaData } from '../../types/stock';
import { TrendingUp, Clock, Globe } from 'lucide-react';

interface MetaDataCardProps {
  metaData: StockMetaData;
}

export const MetaDataCard: React.FC<MetaDataCardProps> = ({ metaData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Stock Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg font-bold">
                {metaData['2. Symbol']}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Symbol</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{metaData['3. Last Refreshed']}</span>
            </div>
            <p className="text-sm text-gray-600">Last Refreshed</p>
          </div>
          
          {metaData['4. Interval'] && (
            <div className="space-y-2">
              <Badge variant="outline">{metaData['4. Interval']}</Badge>
              <p className="text-sm text-gray-600">Interval</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Badge variant="outline">{metaData['5. Output Size']}</Badge>
            <p className="text-sm text-gray-600">Output Size</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Time Zone: {metaData['6. Time Zone']}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
