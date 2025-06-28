
import { StockApiResponse, ParsedStockData } from '../types/stock';

export function parseStockData(apiResponse: StockApiResponse): ParsedStockData {
  const metaData = apiResponse['Meta Data'];
  
  // Find the time series key dynamically
  const timeSeriesKey = Object.keys(apiResponse).find(key => 
    key.startsWith('Time Series')
  );
  
  if (!timeSeriesKey || !apiResponse[timeSeriesKey]) {
    throw new Error('Invalid stock data format');
  }
  
  const timeSeriesData = apiResponse[timeSeriesKey];
  
  // Convert the time series data to an array and sort by timestamp
  const timeSeries = Object.entries(timeSeriesData)
    .map(([timestamp, data]: [string, any]) => ({
      timestamp,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  return {
    metaData,
    timeSeries,
  };
}
