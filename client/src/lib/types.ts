// Types for the application state
export interface TruckParameters {
  // Truck information
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
  
  // Fixed costs
  value: number;
  amortizationYears: number;
  insurance: number;
  roadTax: number;
  inspection: number;
  tachograph: number;
  
  // Variable costs
  fuelCost: number;
  tiresCost: number;
  tollCost: number;
  foodLodgingCost: number;
  loadUnloadCost: number;
  maintenanceCost: number;
}

export interface TaxSettings {
  regime: 'forfettario' | 'ordinario';
  irpef: number;
  regionalTax: number;
  municipalTax: number;
  inps: number;
  vat: number;
  applyVatByDefault: boolean;
  vatNote: string;
}

export interface Trip {
  origin: string;
  destination: string;
  distance: number;
  hours: number;
  roadType: 'Autostrada' | 'Statale' | 'Misto';
  loadUnloadHours: number;
  hasVat: boolean;
}

export interface CostBreakdownItem {
  name: string;
  amount: number;
  category: 'fixed' | 'variable';
}

export interface QuoteDetails {
  id?: number;
  origin: string;
  destination: string;
  distance: number;
  hours: number;
  roadType: string;
  loadUnloadHours: number;
  hasVat: boolean;
  costs: CostBreakdownItem[];
  totalCost: number;
  margin: number;
  marginRate: number;
  subtotal: number;
  vatAmount: number | null;
  finalPrice: number;
  costPerKm: number;
  pricePerKm: number;
  status?: 'pending' | 'confirmed' | 'rejected';
  created?: Date;
}

export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  progressPercentage: number;
  prefix?: string;
  suffix?: string;
}
