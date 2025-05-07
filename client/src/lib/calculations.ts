import { TruckParameters, TaxSettings, Trip, CostBreakdownItem, QuoteDetails } from './types';

// Calculate amortization per km
const calculateAmortizationPerKm = (params: TruckParameters, distance: number): number => {
  // Annual amortization = truck value / years
  const annualAmortization = params.value / params.amortizationYears;
  
  // Assume 100,000 km per year as standard for a commercial truck
  const estimatedAnnualKm = 100000;
  
  // Amortization per km
  const amortizationPerKm = annualAmortization / estimatedAnnualKm;
  
  return amortizationPerKm * distance;
};

// Calculate insurance per trip
const calculateInsurancePerTrip = (params: TruckParameters, distance: number): number => {
  // Assume 100,000 km per year
  const estimatedAnnualKm = 100000;
  
  // Insurance per km
  const insurancePerKm = params.insurance / estimatedAnnualKm;
  
  return insurancePerKm * distance;
};

// Calculate road tax per trip
const calculateRoadTaxPerTrip = (params: TruckParameters, distance: number): number => {
  // Assume 100,000 km per year
  const estimatedAnnualKm = 100000;
  
  // Road tax per km
  const roadTaxPerKm = params.roadTax / estimatedAnnualKm;
  
  return roadTaxPerKm * distance;
};

// Calculate inspection and tachograph costs per trip
const calculateInspectionTachographPerTrip = (
  params: TruckParameters, 
  distance: number
): { inspection: number; tachograph: number } => {
  // Assume 100,000 km per year
  const estimatedAnnualKm = 100000;
  
  // Costs per km
  const inspectionPerKm = params.inspection / estimatedAnnualKm;
  const tachographPerKm = params.tachograph / estimatedAnnualKm;
  
  return {
    inspection: inspectionPerKm * distance,
    tachograph: tachographPerKm * distance,
  };
};

// Calculate fuel cost
const calculateFuelCost = (params: TruckParameters, distance: number): number => {
  return params.fuelCost * distance;
};

// Calculate tires cost
const calculateTiresCost = (params: TruckParameters, distance: number): number => {
  return params.tiresCost * distance;
};

// Calculate toll cost (may vary based on road type)
const calculateTollCost = (params: TruckParameters, distance: number, roadType: string): number => {
  // Adjust toll cost based on road type
  let tollMultiplier = 1.0;
  
  switch (roadType) {
    case 'Autostrada':
      tollMultiplier = 1.0; // Full toll for highways
      break;
    case 'Statale':
      tollMultiplier = 0.1; // Almost no tolls on state roads
      break;
    case 'Misto':
      tollMultiplier = 0.6; // Partial toll for mixed roads
      break;
    default:
      tollMultiplier = 1.0;
  }
  
  return params.tollCost * distance * tollMultiplier;
};

// Calculate food and lodging cost
const calculateFoodLodgingCost = (params: TruckParameters, hours: number): number => {
  // Assume one day is 8 working hours
  const days = Math.ceil(hours / 8);
  return params.foodLodgingCost * days;
};

// Calculate loading/unloading cost
const calculateLoadUnloadCost = (params: TruckParameters, loadUnloadHours: number): number => {
  return params.loadUnloadCost * loadUnloadHours;
};

// Calculate maintenance cost
const calculateMaintenanceCost = (params: TruckParameters, distance: number): number => {
  return params.maintenanceCost * distance;
};

// Calculate cost breakdown
export const calculateCostBreakdown = (
  truckParams: TruckParameters,
  trip: Trip
): CostBreakdownItem[] => {
  const { distance, hours, roadType, loadUnloadHours } = trip;
  
  // Calculate fixed costs
  const amortization = calculateAmortizationPerKm(truckParams, distance);
  const insurance = calculateInsurancePerTrip(truckParams, distance);
  const roadTax = calculateRoadTaxPerTrip(truckParams, distance);
  const { inspection, tachograph } = calculateInspectionTachographPerTrip(truckParams, distance);
  
  // Calculate variable costs
  const fuel = calculateFuelCost(truckParams, distance);
  const tires = calculateTiresCost(truckParams, distance);
  const tolls = calculateTollCost(truckParams, distance, roadType);
  const foodLodging = calculateFoodLodgingCost(truckParams, hours);
  const loadUnload = calculateLoadUnloadCost(truckParams, loadUnloadHours);
  const maintenance = calculateMaintenanceCost(truckParams, distance);
  
  // Return cost breakdown
  return [
    { name: 'Ammortamento camion', amount: amortization, category: 'fixed' },
    { name: 'Assicurazione', amount: insurance, category: 'fixed' },
    { name: 'Bollo', amount: roadTax, category: 'fixed' },
    { name: 'Revisione', amount: inspection, category: 'fixed' },
    { name: 'Cronotachigrafo', amount: tachograph, category: 'fixed' },
    { name: 'Gasolio', amount: fuel, category: 'variable' },
    { name: 'Pneumatici', amount: tires, category: 'variable' },
    { name: 'Pedaggi', amount: tolls, category: 'variable' },
    { name: 'Vitto e alloggio', amount: foodLodging, category: 'variable' },
    { name: 'Carico/scarico', amount: loadUnload, category: 'variable' },
    { name: 'Manutenzioni', amount: maintenance, category: 'variable' },
  ];
};

// Calculate quote details
export const calculateQuote = (
  truckParams: TruckParameters,
  taxSettings: TaxSettings,
  trip: Trip,
  marginRate: number = 25 // Default margin of 25%
): QuoteDetails => {
  const costBreakdown = calculateCostBreakdown(truckParams, trip);
  
  // Calculate total cost
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate margin
  const margin = totalCost * (marginRate / 100);
  
  // Calculate subtotal (cost + margin)
  const subtotal = totalCost + margin;
  
  // Calculate VAT if applicable
  const vatAmount = trip.hasVat ? subtotal * (taxSettings.vat / 100) : null;
  
  // Calculate final price
  const finalPrice = vatAmount ? subtotal + vatAmount : subtotal;
  
  // Calculate cost and price per km
  const costPerKm = totalCost / trip.distance;
  const pricePerKm = finalPrice / trip.distance;
  
  return {
    origin: trip.origin,
    destination: trip.destination,
    distance: trip.distance,
    hours: trip.hours,
    roadType: trip.roadType,
    loadUnloadHours: trip.loadUnloadHours,
    hasVat: trip.hasVat,
    costs: costBreakdown,
    totalCost,
    margin,
    marginRate,
    subtotal,
    vatAmount,
    finalPrice,
    costPerKm,
    pricePerKm,
  };
};

// Calculate monthly fixed costs
export const calculateMonthlyFixedCosts = (params: TruckParameters): number => {
  const annualAmortization = params.value / params.amortizationYears;
  
  // Monthly fixed costs
  return (
    annualAmortization / 12 +
    params.insurance / 12 +
    params.roadTax / 12 +
    params.inspection / 12 +
    params.tachograph / 12
  );
};

// Calculate average cost per km
export const calculateAverageCostPerKm = (params: TruckParameters): number => {
  // Fixed costs per km (assuming 100,000 km/year)
  const fixedCostPerKm = (
    (params.value / params.amortizationYears) +
    params.insurance +
    params.roadTax +
    params.inspection +
    params.tachograph
  ) / 100000;
  
  // Variable costs per km
  const variableCostPerKm = 
    params.fuelCost +
    params.tiresCost +
    params.tollCost +
    params.maintenanceCost;
  
  // Average cost per km
  return fixedCostPerKm + variableCostPerKm;
};
