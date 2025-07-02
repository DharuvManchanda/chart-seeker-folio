
import React from 'react';
import { Controller, Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IntradayOptionsProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const IntradayOptions: React.FC<IntradayOptionsProps> = ({ control, register, errors }) => {
  return (
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
  );
};
