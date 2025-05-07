import { useState } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { StatCard } from '@/components/ui/stat-card';
import CostChart from '@/components/CostChart';
import QuoteTable from '@/components/QuoteTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTruck } from '@/context/TruckContext';
import { MapPin, DollarSign, FileText, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { truckParams, monthlyFixedCosts, averageCostPerKm, quotes } = useTruck();
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'annual'>('annual');
  
  // Generate stats for the dashboard
  const stats = [
    {
      title: 'Costo Medio per KM',
      value: averageCostPerKm.toFixed(2),
      icon: <MapPin className="h-5 w-5" />,
      progressPercentage: 66,
      prefix: '€',
    },
    {
      title: 'Costi Fissi Mensili',
      value: monthlyFixedCosts.toFixed(0),
      icon: <DollarSign className="h-5 w-5" />,
      progressPercentage: 80,
      prefix: '€',
    },
    {
      title: 'Preventivi Emessi',
      value: quotes.length,
      icon: <FileText className="h-5 w-5" />,
      progressPercentage: 50,
    },
  ];
  
  // Mock data for the chart (would be real data in a production app)
  const mockCostItems = [
    { name: 'Ammortamento camion', amount: 24000, category: 'fixed' },
    { name: 'Assicurazione', amount: 4800, category: 'fixed' },
    { name: 'Carburante', amount: 48000, category: 'variable' },
    { name: 'Manutenzione', amount: 15000, category: 'variable' },
    { name: 'Pedaggi', amount: 15000, category: 'variable' },
    { name: 'Pneumatici', amount: 12000, category: 'variable' },
    { name: 'Vitto e alloggio', amount: 9600, category: 'variable' },
  ];
  
  return (
    <Layout
      title="Dashboard"
      action={
        <Link href="/trip-simulation">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <PlusCircle className="h-5 w-5 mr-2" />
            Nuovo Preventivo
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              progressPercentage={stat.progressPercentage}
              prefix={stat.prefix}
            />
          ))}
        </div>

        {/* Truck Parameters Summary */}
        <Card>
          <CardHeader className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Parametri Camion</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Costi Fissi</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Valore Camion</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.value.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Anni Ammortamento</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{truckParams.amortizationYears} anni</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Assicurazione Annua</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.insurance.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Revisione</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.inspection.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Bollo Annuo</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.roadTax.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Costi Variabili</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Gasolio</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.fuelCost.toFixed(2)}/km</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Pneumatici</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.tiresCost.toFixed(2)}/km</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Vitto e Alloggio</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.foodLodgingCost.toFixed(0)}/giorno</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Carico/Scarico</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.loadUnloadCost.toFixed(0)}/ora</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-300">Manutenzioni</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">€{truckParams.maintenanceCost.toFixed(2)}/km</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/truck-parameters" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                <span>Modifica parametri</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis Chart */}
        <CostChart costs={mockCostItems} />

        {/* Recent Quotes */}
        <Card>
          <CardHeader className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Preventivi Recenti</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <QuoteTable />
            {quotes.length > 3 && (
              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
                <Link href="/trip-simulation" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                  Vedi tutti i preventivi
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
