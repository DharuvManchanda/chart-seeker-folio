
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ParsedStockData } from '../../types/stock';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

interface TimeSeriesTableProps {
  data: ParsedStockData;
}

export const TimeSeriesTable: React.FC<TimeSeriesTableProps> = ({ data }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const sortedData = [...data.timeSeries].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const isIntraday = data.metaData['4. Interval'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Series Data - {data.metaData['2. Symbol']}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={toggleSort}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    {isIntraday ? 'Date/Time' : 'Date'}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Open</TableHead>
                <TableHead className="text-right">High</TableHead>
                <TableHead className="text-right">Low</TableHead>
                <TableHead className="text-right">Close</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {isIntraday
                      ? format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')
                      : format(new Date(item.timestamp), 'MMM dd, yyyy')
                    }
                  </TableCell>
                  <TableCell className="text-right">${item.open.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.high.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.low.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${item.close.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
