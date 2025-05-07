import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Le password non corrispondono');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      toast({
        title: "Account creato",
        description: "Il tuo account è stato creato con successo",
      });
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Errore durante la registrazione';
      
      // Handle specific Firebase Auth errors
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email già in uso';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password troppo debole';
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
            Registrati
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
              <Label htmlFor="name">Nome completo (opzionale)</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Conferma Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Hai già un account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Accedi
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}