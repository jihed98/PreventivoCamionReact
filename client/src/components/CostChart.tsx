import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostBreakdownItem } from '@/lib/types';

interface CostChartProps {
  costs: CostBreakdownItem[];
}

export default function CostChart({ costs }: CostChartProps) {
  const [chartView, setChartView] = useState<'category' | 'detailed'>('category');

  // Group costs by category (fixed vs variable)
  const categoryData = [
    {
      name: 'Costi Fissi',
      value: costs.filter(cost => cost.category === 'fixed').reduce((sum, item) => sum + item.amount, 0),
      color: '#3B82F6' // blue-500
    },
    {
      name: 'Costi Variabili',
      value: costs.filter(cost => cost.category === 'variable').reduce((sum, item) => sum + item.amount, 0),
      color: '#10B981' // green-500
    }
  ];

  // Data for detailed view
  const detailedData = costs.map((cost, index) => {
    // Generate a color based on category
    const baseColor = cost.category === 'fixed' ? '#3B82F6' : '#10B981';
    const colorVariation = Math.max(0, 1 - (index * 0.2));
    
    return {
      name: cost.name,
      value: cost.amount,
      color: baseColor,
      colorVariation
    };
  });

  const currentData = chartView === 'category' ? categoryData : detailedData;

  // Calculate the total amount for the center of the chart
  const totalAmount = costs.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Analisi Costi</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={chartView === 'category' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartView('category')}
            className="text-sm"
          >
            Categoria
          </Button>
          <Button 
            variant={chartView === 'detailed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartView('detailed')}
            className="text-sm"
          >
            Dettaglio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={chartView === 'category' ? 60 : 50}
                outerRadius={chartView === 'category' ? 80 : 90}
                paddingAngle={1}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {currentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={entry.colorVariation !== undefined ? entry.colorVariation : 1}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`€${value.toFixed(2)}`, 'Importo']} 
                labelFormatter={(name) => `${name}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center value */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Totale</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">€{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
