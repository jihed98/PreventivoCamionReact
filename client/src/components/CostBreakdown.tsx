import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostBreakdownItem, QuoteDetails } from '@/lib/types';
import { formatter } from '@/lib/utils';

interface CostBreakdownProps {
  quote: QuoteDetails;
}

export default function CostBreakdown({ quote }: CostBreakdownProps) {
  const fixedCosts = quote.costs.filter(cost => cost.category === 'fixed');
  const variableCosts = quote.costs.filter(cost => cost.category === 'variable');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Riepilogo Costi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Dettaglio Costi</h4>
            <div className="space-y-3">
              {/* Fixed costs */}
              {fixedCosts.map((cost, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{cost.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(cost.amount)}
                  </span>
                </div>
              ))}

              {/* Variable costs */}
              {variableCosts.map((cost, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{cost.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(cost.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Final Quote */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Costo Totale</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(quote.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Margine ({quote.marginRate}%)
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(quote.margin)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sub-totale</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(quote.subtotal)}
                  </span>
                </div>
                {quote.hasVat && quote.vatAmount !== null && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">IVA (22%)</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatter.format(quote.vatAmount)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-base font-medium text-gray-700 dark:text-gray-200">PREZZO FINALE</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-500">
                  {formatter.format(quote.finalPrice)}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Costo per km</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(quote.costPerKm)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Prezzo per km</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatter.format(quote.pricePerKm)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
