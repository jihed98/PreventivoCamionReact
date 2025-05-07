import { useState, FormEvent, useRef } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { handleFirebaseError } from '../../utils/firebase-errors';

export default function ResetPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Validazione
    if (!emailRef.current?.value) {
      return setError('Inserisci la tua email');
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await resetPassword(emailRef.current.value);
      setMessage('Controlla la tua email per le istruzioni sul reset della password');
    } catch (err) {
      setError(handleFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-gray-600">Riceverai un'email con le istruzioni</p>
        </div>
        
        {error && (
          <div className="p-3 mb-3 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {message && (
          <div className="p-3 mb-3 text-sm text-green-500 bg-green-100 rounded-md">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Invio in corso...' : 'Invia istruzioni'}
            </button>
          </div>
        </form>
        
        <div className="text-center space-y-2 mt-4">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Torna al login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Non hai un account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}