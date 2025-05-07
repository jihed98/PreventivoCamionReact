import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, PrivateRoute, Login, Signup, ResetPassword, useAuth } from '../auth-index';

// Un componente di esempio che utilizza l'autenticazione
function Dashboard() {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="mb-2">
          <strong>Utente autenticato:</strong> {currentUser?.email}
        </p>
        {currentUser?.displayName && (
          <p className="mb-2">
            <strong>Nome:</strong> {currentUser.displayName}
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Link 
          to="/profile" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Profilo
        </Link>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Un componente di profilo di esempio
function Profile() {
  const { currentUser } = useAuth();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profilo Utente</h1>
      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="mb-2">
          <strong>Email:</strong> {currentUser?.email}
        </p>
        <p className="mb-2">
          <strong>Nome:</strong> {currentUser?.displayName || 'Non impostato'}
        </p>
        <p className="mb-2">
          <strong>Account creato:</strong> {currentUser?.metadata.creationTime}
        </p>
        <p className="mb-2">
          <strong>Ultimo accesso:</strong> {currentUser?.metadata.lastSignInTime}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link 
          to="/update-profile" 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Modifica Profilo
        </Link>
        <Link 
          to="/" 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Torna alla Dashboard
        </Link>
      </div>
    </div>
  );
}

// Applicazione principale che integra l'autenticazione
export default function AuthIntegrationExample() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rotte protette */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}