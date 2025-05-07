import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function UpdateProfile() {
  const { currentUser, updateUserEmail, updateUserPassword, updateUserProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setName(currentUser.displayName || '');
    }
  }, [currentUser]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      return setError('Le password non corrispondono');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const promises = [];
      
      if (email !== currentUser?.email) {
        promises.push(updateUserEmail(email));
      }
      
      if (name !== currentUser?.displayName) {
        promises.push(updateUserProfile(name));
      }
      
      if (password) {
        promises.push(updateUserPassword(password));
      }
      
      await Promise.all(promises);
      
      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo è stato aggiornato con successo",
      });
      
      // Reset password fields
      setPassword('');
      setConfirmPassword('');
      
    } catch (err: any) {
      let errorMessage = 'Errore durante l\'aggiornamento del profilo';
      
      // Handle specific Firebase Auth errors
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'Questa operazione è sensibile e richiede una autenticazione recente. Effettua nuovamente il login.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email già in uso';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Aggiorna Profilo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-xs text-gray-500">(lascia vuoto per mantenere uguale)</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Conferma Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!password}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Annulla
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}