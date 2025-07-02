
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FunctionTypeSelectorProps {
  control: Control<any>;
}

export const FunctionTypeSelector: React.FC<FunctionTypeSelectorProps> = ({ control }) => {
  return (
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
  );
};
