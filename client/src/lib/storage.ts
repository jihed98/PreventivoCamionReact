import { TruckParameters, TaxSettings, QuoteDetails } from './types';

// Default truck parameters
export const defaultTruckParams: TruckParameters = {
  brand: 'Volvo',
  model: 'FH16',
  year: 2020,
  licensePlate: 'AB123CD',
  capacity: 25,
  value: 120000,
  amortizationYears: 5,
  insurance: 4800,
  roadTax: 1200,
  inspection: 500,
  tachograph: 350,
  fuelCost: 0.48,
  tiresCost: 0.12,
  tollCost: 0.15,
  foodLodgingCost: 80,
  loadUnloadCost: 35,
  maintenanceCost: 0.15,
};

// Default tax settings
export const defaultTaxSettings: TaxSettings = {
  regime: 'forfettario',
  irpef: 23,
  regionalTax: 1.23,
  municipalTax: 0.8,
  inps: 24,
  vat: 22,
  applyVatByDefault: true,
  vatNote: 'IVA 22% inclusa nel prezzo.',
};

// Storage keys
const TRUCK_PARAMS_KEY = 'truckcost_parameters';
const TAX_SETTINGS_KEY = 'truckcost_taxsettings';
const QUOTES_KEY = 'truckcost_quotes';

// Save truck parameters to localStorage
export const saveTruckParams = (params: TruckParameters): void => {
  localStorage.setItem(TRUCK_PARAMS_KEY, JSON.stringify(params));
};

// Get truck parameters from localStorage
export const getTruckParams = (): TruckParameters => {
  const stored = localStorage.getItem(TRUCK_PARAMS_KEY);
  if (!stored) {
    return defaultTruckParams;
  }
  
  try {
    return JSON.parse(stored) as TruckParameters;
  } catch (error) {
    console.error('Error parsing truck parameters from localStorage', error);
    return defaultTruckParams;
  }
};

// Save tax settings to localStorage
export const saveTaxSettings = (settings: TaxSettings): void => {
  localStorage.setItem(TAX_SETTINGS_KEY, JSON.stringify(settings));
};

// Get tax settings from localStorage
export const getTaxSettings = (): TaxSettings => {
  const stored = localStorage.getItem(TAX_SETTINGS_KEY);
  if (!stored) {
    return defaultTaxSettings;
  }
  
  try {
    return JSON.parse(stored) as TaxSettings;
  } catch (error) {
    console.error('Error parsing tax settings from localStorage', error);
    return defaultTaxSettings;
  }
};

// Save a quote to localStorage
export const saveQuote = (quote: QuoteDetails): QuoteDetails => {
  const quotes = getQuotes();
  
  // Generate an ID
  const newQuote = {
    ...quote,
    id: quotes.length > 0 ? Math.max(...quotes.map(q => q.id ?? 0)) + 1 : 1,
    created: new Date(),
    status: 'pending' as const,
  };
  
  // Add to quotes array
  quotes.push(newQuote);
  
  // Save to localStorage
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  
  return newQuote;
};

// Get all quotes from localStorage
export const getQuotes = (): QuoteDetails[] => {
  const stored = localStorage.getItem(QUOTES_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored) as QuoteDetails[];
  } catch (error) {
    console.error('Error parsing quotes from localStorage', error);
    return [];
  }
};

// Update a quote's status
export const updateQuoteStatus = (id: number, status: 'pending' | 'confirmed' | 'rejected'): void => {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === id);
  
  if (index !== -1) {
    quotes[index].status = status;
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  }
};

// Clear all data (for testing/development)
export const clearAllData = (): void => {
  localStorage.removeItem(TRUCK_PARAMS_KEY);
  localStorage.removeItem(TAX_SETTINGS_KEY);
  localStorage.removeItem(QUOTES_KEY);
};
