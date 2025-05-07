import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TruckParameters, 
  TaxSettings, 
  QuoteDetails
} from '@/lib/types';
import { 
  getTruckParams, 
  saveTruckParams, 
  getTaxSettings, 
  saveTaxSettings,
  getQuotes,
  saveQuote as storeQuote,
  updateQuoteStatus as updateStoredQuoteStatus
} from '@/lib/storage';
import { 
  calculateQuote, 
  calculateMonthlyFixedCosts,
  calculateAverageCostPerKm
} from '@/lib/calculations';
import { apiRequest } from '@/lib/queryClient';

interface TruckContextType {
  truckParams: TruckParameters;
  updateTruckParams: (params: TruckParameters) => void;
  taxSettings: TaxSettings;
  updateTaxSettings: (settings: TaxSettings) => void;
  quotes: QuoteDetails[];
  saveQuote: (quote: QuoteDetails) => QuoteDetails;
  updateQuoteStatus: (id: number, status: 'pending' | 'confirmed' | 'rejected') => void;
  calculateNewQuote: (
    trip: {
      origin: string;
      destination: string;
      distance: number;
      hours: number;
      roadType: 'Autostrada' | 'Statale' | 'Misto';
      loadUnloadHours: number;
      hasVat: boolean;
    },
    marginRate?: number
  ) => QuoteDetails;
  monthlyFixedCosts: number;
  averageCostPerKm: number;
}

const TruckContext = createContext<TruckContextType | undefined>(undefined);

export const TruckProvider = ({ children }: { children: ReactNode }) => {
  const [truckParams, setTruckParams] = useState<TruckParameters>(getTruckParams());
  const [taxSettings, setTaxSettings] = useState<TaxSettings>(getTaxSettings());
  const [quotes, setQuotes] = useState<QuoteDetails[]>(getQuotes());
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState<number>(0);
  const [averageCostPerKm, setAverageCostPerKm] = useState<number>(0);

  // Update derived values when truck parameters change
  useEffect(() => {
    setMonthlyFixedCosts(calculateMonthlyFixedCosts(truckParams));
    setAverageCostPerKm(calculateAverageCostPerKm(truckParams));
  }, [truckParams]);

  // Update truck parameters
  const updateTruckParams = (params: TruckParameters) => {
    setTruckParams(params);
    saveTruckParams(params);
  };

  // Update tax settings
  const updateTaxSettings = (settings: TaxSettings) => {
    setTaxSettings(settings);
    saveTaxSettings(settings);
  };

  // Save a quote
  const saveQuote = (quote: QuoteDetails) => {
    const newQuote = storeQuote(quote);
    setQuotes([...quotes, newQuote]);
    return newQuote;
  };

  // Update a quote's status
  const updateQuoteStatus = (id: number, status: 'pending' | 'confirmed' | 'rejected') => {
    updateStoredQuoteStatus(id, status);
    setQuotes(
      quotes.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      )
    );
  };

  // Calculate a new quote
  const calculateNewQuote = (
    trip: {
      origin: string;
      destination: string;
      distance: number;
      hours: number;
      roadType: 'Autostrada' | 'Statale' | 'Misto';
      loadUnloadHours: number;
      hasVat: boolean;
    },
    marginRate = 25
  ) => {
    return calculateQuote(truckParams, taxSettings, trip, marginRate);
  };

  const contextValue: TruckContextType = {
    truckParams,
    updateTruckParams,
    taxSettings,
    updateTaxSettings,
    quotes,
    saveQuote,
    updateQuoteStatus,
    calculateNewQuote,
    monthlyFixedCosts,
    averageCostPerKm
  };

  return (
    <TruckContext.Provider value={contextValue}>
      {children}
    </TruckContext.Provider>
  );
};

export const useTruck = () => {
  const context = useContext(TruckContext);
  if (context === undefined) {
    throw new Error('useTruck must be used within a TruckProvider');
  }
  return context;
};
