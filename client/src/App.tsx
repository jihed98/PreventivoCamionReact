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
import QuoteHistory from "@/pages/QuoteHistory";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import ResetPassword from "@/components/auth/ResetPassword";
import UpdateProfile from "@/components/auth/UpdateProfile";
import PrivateRoute from "@/components/PrivateRoute";
import { TruckProvider } from "./context/TruckContext";
import { AuthProvider } from "./context/AuthContext";

function Router() {
  return (
    <Switch>
      {/* Rotte pubbliche per l'autenticazione */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/reset-password" component={ResetPassword} />
      
      {/* Rotte protette che richiedono autenticazione */}
      <Route path="/">
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Route>
      <Route path="/truck-parameters">
        <PrivateRoute>
          <TruckParameters />
        </PrivateRoute>
      </Route>
      <Route path="/tax-settings">
        <PrivateRoute>
          <TaxSettings />
        </PrivateRoute>
      </Route>
      <Route path="/trip-simulation">
        <PrivateRoute>
          <TripSimulation />
        </PrivateRoute>
      </Route>
      <Route path="/quote-history">
        <PrivateRoute>
          <QuoteHistory />
        </PrivateRoute>
      </Route>
      <Route path="/profile">
        <PrivateRoute>
          <UpdateProfile />
        </PrivateRoute>
      </Route>
      
      {/* Pagina non trovata */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TruckProvider>
            <Toaster />
            <Router />
          </TruckProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
