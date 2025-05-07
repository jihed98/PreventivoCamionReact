import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TaxSettings } from '@/lib/types';
import { useTruck } from '@/context/TruckContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const taxSettingsSchema = z.object({
  regime: z.enum(['forfettario', 'ordinario']),
  irpef: z.coerce.number().min(0).max(100),
  regionalTax: z.coerce.number().min(0).max(100),
  municipalTax: z.coerce.number().min(0).max(100),
  inps: z.coerce.number().min(0).max(100),
  vat: z.coerce.number().min(0).max(100),
  applyVatByDefault: z.boolean(),
  vatNote: z.string().optional(),
});

export default function TaxSettingsForm() {
  const { taxSettings, updateTaxSettings } = useTruck();
  const { toast } = useToast();

  const form = useForm<TaxSettings>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: taxSettings,
  });

  const onSubmit = (data: TaxSettings) => {
    updateTaxSettings(data);
    toast({
      title: "Impostazioni Fiscali Salvate",
      description: "Le impostazioni fiscali sono state aggiornate con successo.",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Fiscal Regime Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Regime Fiscale</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="regime"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="forfettario" id="regime-forfettario" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="regime-forfettario" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Regime Forfettario
                          </label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="ordinario" id="regime-ordinario" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="regime-ordinario" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Regime Ordinario
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tax Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Aliquote Fiscali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="irpef"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">IRPEF (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="regionalTax"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Addizionale Regionale (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="inps"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">INPS (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="municipalTax"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Addizionale Comunale (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VAT Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Impostazioni IVA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aliquota IVA Standard (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="applyVatByDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Applica IVA di default ai nuovi preventivi
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vatNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nota IVA per preventivi (opzionale)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Questa nota sarà visualizzata nei preventivi con IVA applicata.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            Salva Modifiche
          </Button>
        </form>
      </Form>
    </div>
  );
}
