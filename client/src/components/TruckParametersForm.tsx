import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TruckParameters } from '@/lib/types';
import { useTruck } from '@/context/TruckContext';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const truckParamsSchema = z.object({
  brand: z.string().min(1, { message: 'La marca è obbligatoria' }),
  model: z.string().min(1, { message: 'Il modello è obbligatorio' }),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear()),
  licensePlate: z.string().min(1, { message: 'La targa è obbligatoria' }),
  capacity: z.coerce.number().positive(),
  value: z.coerce.number().positive(),
  amortizationYears: z.coerce.number().int().positive(),
  insurance: z.coerce.number().nonnegative(),
  roadTax: z.coerce.number().nonnegative(),
  inspection: z.coerce.number().nonnegative(),
  tachograph: z.coerce.number().nonnegative(),
  fuelCost: z.coerce.number().nonnegative(),
  tiresCost: z.coerce.number().nonnegative(),
  tollCost: z.coerce.number().nonnegative(),
  foodLodgingCost: z.coerce.number().nonnegative(),
  loadUnloadCost: z.coerce.number().nonnegative(),
  maintenanceCost: z.coerce.number().nonnegative(),
});

export default function TruckParametersForm() {
  const { truckParams, updateTruckParams } = useTruck();
  const { toast } = useToast();

  const form = useForm<TruckParameters>({
    resolver: zodResolver(truckParamsSchema),
    defaultValues: truckParams,
  });

  const onSubmit = (data: TruckParameters) => {
    updateTruckParams(data);
    toast({
      title: "Parametri Salvati",
      description: "I parametri del camion sono stati aggiornati con successo.",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Truck Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Informazioni Camion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-5">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                    <div className="p-4 bg-blue-500 text-white flex items-center justify-center text-4xl">
                      <Truck />
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Un camion moderno per la logistica</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Marca</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Modello</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Anno</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licensePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Targa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Portata (ton)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fixed Costs Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Costi Fissi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valore Camion (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amortizationYears"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anni Ammortamento</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="insurance"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assicurazione Annua (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="inspection"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Revisione (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roadTax"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bollo Annuo (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tachograph"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cronotachigrafo (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variable Costs Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Costi Variabili</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="fuelCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gasolio (€/km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiresCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pneumatici (€/km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tollCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pedaggi Autostradali (€/km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="foodLodgingCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vitto e Alloggio (€/giorno)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loadUnloadCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carico/Scarico (€/ora)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maintenanceCost"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manutenzioni (€/km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
