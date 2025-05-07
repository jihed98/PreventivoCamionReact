import { Redirect } from 'wouter';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Componente per proteggere le rotte che richiedono autenticazione
 * Redireziona alla pagina di login se l'utente non è autenticato
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser, loading } = useAuth();
  
  // Se stiamo ancora caricando l'autenticazione, non mostrare nulla
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Se l'utente non è autenticato, reindirizza al login
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  // Altrimenti mostra il contenuto della rotta
  return <>{children}</>;
}