import { useState } from 'react';
import Layout from '@/components/Layout';
import TripForm from '@/components/TripForm';
import CostBreakdown from '@/components/CostBreakdown';
import CostChart from '@/components/CostChart';
import ExportPdfButton from '@/components/ExportPdfButton';
import { QuoteDetails } from '@/lib/types';
import { useTruck } from '@/context/TruckContext';
import { useToast } from '@/hooks/use-toast';

export default function TripSimulation() {
  const [quoteResult, setQuoteResult] = useState<QuoteDetails | null>(null);
  const { saveQuote } = useTruck();
  const { toast } = useToast();

  const handleCalculate = (quote: QuoteDetails) => {
    setQuoteResult(quote);
  };

  const handleSaveQuote = () => {
    if (quoteResult) {
      const savedQuote = saveQuote(quoteResult);
      toast({
        title: "Preventivo Salvato",
        description: `Il preventivo da ${savedQuote.origin} a ${savedQuote.destination} è stato salvato con successo.`,
      });
    }
  };

  return (
    <Layout
      title="Simulazione Viaggio"
      action={
        quoteResult ? (
          <ExportPdfButton quote={quoteResult} />
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trip Details Form */}
        <div className="md:col-span-1">
          <TripForm onCalculate={handleCalculate} />
        </div>

        {/* Cost Breakdown */}
        {quoteResult ? (
          <div className="md:col-span-2 space-y-6">
            <CostBreakdown quote={quoteResult} />
            
            {/* Save Quote button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveQuote}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Salva Preventivo
              </button>
            </div>
            
            {/* Cost Chart */}
            <CostChart costs={quoteResult.costs} />
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Nessun preventivo calcolato</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Compila i dettagli del viaggio a sinistra e clicca su "Calcola Preventivo" per vedere il risultato qui.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
