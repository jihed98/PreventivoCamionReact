import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TruckParameters from "@/pages/TruckParameters";
import TaxSettings from "@/pages/TaxSettings";
import TripSimulation from "@/pages/TripSimulation";
import { TruckProvider } from "./context/TruckContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/truck-parameters" component={TruckParameters} />
      <Route path="/tax-settings" component={TaxSettings} />
      <Route path="/trip-simulation" component={TripSimulation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TruckProvider>
          <Toaster />
          <Router />
        </TruckProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
