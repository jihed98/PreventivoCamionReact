import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import UpdateProfile from './components/auth/UpdateProfile';
import Home from './components/Home';
import NotFound from './pages/not-found';

/**
 * Applicazione principale per il modulo di autenticazione
 * Definisce tutte le rotte e avvolge l'applicazione con il provider di autenticazione
 */
export default function AuthApp() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rotte protette */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
          </Route>
          
          {/* Pagina 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}