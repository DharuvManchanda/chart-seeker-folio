
import { z } from 'zod';

export const stockQuerySchema = z.object({
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

export type StockQueryFormData = z.infer<typeof stockQuerySchema>;
