import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Controlla la tua email per le istruzioni su come reimpostare la password');
      toast({
        title: "Email inviata",
        description: "Controlla la tua email per le istruzioni",
      });
    } catch (err: any) {
      let errorMessage = 'Errore durante l\'invio dell\'email';
      
      // Handle specific Firebase Auth errors
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Nessun account trovato con questa email';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email non valida';
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
            Reimposta Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Invio in corso...' : 'Reimposta Password'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Torna al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}