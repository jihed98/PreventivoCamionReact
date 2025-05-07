import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente per proteggere le rotte che richiedono autenticazione
 * Redireziona alla pagina di login se l'utente non è autenticato
 */
export default function PrivateRoute() {
  const { currentUser } = useAuth();
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}