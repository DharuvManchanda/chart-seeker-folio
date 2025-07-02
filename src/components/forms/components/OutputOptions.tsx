
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface OutputOptionsProps {
  control: Control<any>;
}

export const OutputOptions: React.FC<OutputOptionsProps> = ({ control }) => {
  return (
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
  );
};
