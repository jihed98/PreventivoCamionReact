import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useTruck } from '@/context/TruckContext';
import { Trip } from '@/lib/types';

interface TripFormProps {
  onCalculate: (quote: any) => void;
}

const tripSchema = z.object({
  origin: z.string().min(1, { message: 'L\'origine è obbligatoria' }),
  destination: z.string().min(1, { message: 'La destinazione è obbligatoria' }),
  distance: z.coerce.number().positive({ message: 'La distanza deve essere maggiore di 0' }),
  hours: z.coerce.number().positive({ message: 'Le ore devono essere maggiori di 0' }),
  roadType: z.enum(['Autostrada', 'Statale', 'Misto']),
  loadUnloadHours: z.coerce.number().min(0, { message: 'Le ore di carico/scarico non possono essere negative' }),
  hasVat: z.boolean(),
});

export default function TripForm({ onCalculate }: TripFormProps) {
  const { taxSettings, calculateNewQuote } = useTruck();
  const [marginRate, setMarginRate] = useState(25); // Default margin of 25%

  const form = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      origin: '',
      destination: '',
      distance: 0,
      hours: 0,
      roadType: 'Autostrada',
      loadUnloadHours: 0,
      hasVat: taxSettings.applyVatByDefault,
    },
  });

  const handleCalculate = (data: Trip) => {
    const quote = calculateNewQuote(data, marginRate);
    onCalculate(quote);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Dettagli Viaggio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Da</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Città di partenza" 
                      {...field} 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">A</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Città di arrivo" 
                      {...field} 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Distanza (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Ore di Viaggio</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo di Strada</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Seleziona tipo di strada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Autostrada">Autostrada</SelectItem>
                      <SelectItem value="Statale">Statale</SelectItem>
                      <SelectItem value="Misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loadUnloadHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Ore di Carico/Scarico</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasVat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Cliente</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="client-with-vat" />
                        <label htmlFor="client-with-vat" className="text-sm text-gray-700 dark:text-gray-300">Con IVA</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="client-without-vat" />
                        <label htmlFor="client-without-vat" className="text-sm text-gray-700 dark:text-gray-300">Senza IVA</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Margine (%): {marginRate}%</FormLabel>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={marginRate}
                onChange={(e) => setMarginRate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mt-4"
            >
              Calcola Preventivo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
