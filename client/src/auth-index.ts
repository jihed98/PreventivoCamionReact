// Esporta i componenti di autenticazione
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ResetPassword from './components/auth/ResetPassword';
import UpdateProfile from './components/auth/UpdateProfile';
import AuthApp from './AuthApp';

// Esporta le utilità per la gestione degli errori
import { handleFirebaseError, getErrorMessage } from './utils/firebase-errors';

// Esporta l'app completa
export { AuthApp };

// Esporta il provider di autenticazione e l'hook
export { AuthProvider, useAuth };

// Esporta i componenti individuali
export { 
  PrivateRoute,
  Login,
  Signup,
  ResetPassword,
  UpdateProfile
};

// Esporta le utilità per gli errori
export {
  handleFirebaseError,
  getErrorMessage
};