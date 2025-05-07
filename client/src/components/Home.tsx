import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { handleFirebaseError } from '../utils/firebase-errors';

export default function Home() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleLogout() {
    try {
      setError('');
      setLoading(true);
      await logout();
    } catch (err) {
      setError(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Uscita...' : 'Logout'}
            </button>
          </div>
          
          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Profilo Utente</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Email:</span> {currentUser?.email}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Nome:</span> {currentUser?.displayName || 'Non impostato'}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Account verificato:</span> {currentUser?.emailVerified ? 'Sì' : 'No'}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">UID:</span> {currentUser?.uid}
            </p>
            <div className="mt-4">
              <Link
                to="/update-profile"
                className="inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aggiorna Profilo
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Funzionalità dell'Applicazione</h2>
            <p className="text-gray-600 mb-4">
              Questa è una dashboard di esempio che mostra come utilizzare l'autenticazione Firebase in un'applicazione React.
              Sei libero di personalizzare questa pagina e aggiungere le funzionalità specifiche della tua applicazione.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Autenticazione</h3>
                <p className="text-blue-600 mb-3">Funzionalità di gestione dell'account utente.</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Login/logout</li>
                  <li>Registrazione</li>
                  <li>Reset password</li>
                  <li>Aggiornamento profilo</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-lg font-medium text-green-800 mb-2">Sicurezza</h3>
                <p className="text-green-600 mb-3">Funzionalità per la sicurezza dell'account.</p>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Rotte protette</li>
                  <li>Controllo accessi</li>
                  <li>Sessioni sicure</li>
                  <li>Token di autenticazione</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}