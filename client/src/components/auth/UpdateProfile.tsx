import { useState, FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleFirebaseError } from '../../utils/firebase-errors';

export default function UpdateProfile() {
  const { currentUser, updateUserEmail, updateUserPassword, updateUserProfile } = useAuth();
  
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError('Le password non corrispondono');
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Aggiorniamo nome, email e password se forniti
    const promises = [];
    
    try {
      // Aggiorna nome se modificato
      if (nameRef.current?.value && nameRef.current.value !== currentUser?.displayName) {
        promises.push(updateUserProfile(nameRef.current.value));
      }
      
      // Aggiorna email se modificata
      if (emailRef.current?.value && emailRef.current.value !== currentUser?.email) {
        promises.push(updateUserEmail(emailRef.current.value));
      }
      
      // Aggiorna password se fornita
      if (passwordRef.current?.value) {
        promises.push(updateUserPassword(passwordRef.current.value));
      }
      
      // Esegui tutte le operazioni di aggiornamento
      if (promises.length > 0) {
        await Promise.all(promises);
        setSuccess('Profilo aggiornato con successo');
      } else {
        setSuccess('Nessuna modifica effettuata');
      }
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
          <h1 className="text-3xl font-bold">Aggiorna Profilo</h1>
          <p className="mt-2 text-gray-600">Modifica i tuoi dati personali</p>
        </div>
        
        {error && (
          <div className="p-3 mb-3 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 mb-3 text-sm text-green-500 bg-green-100 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                defaultValue={currentUser?.displayName || ''}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                defaultValue={currentUser?.email || ''}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                ref={passwordRef}
                placeholder="Lascia vuoto per non modificare"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                Conferma Password
              </label>
              <input
                type="password"
                id="password-confirm"
                ref={passwordConfirmRef}
                placeholder="Lascia vuoto per non modificare"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Aggiornamento...' : 'Aggiorna'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}