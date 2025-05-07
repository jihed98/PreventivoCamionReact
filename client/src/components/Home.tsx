import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il logout",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Profilo Utente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
            <h2 className="font-medium">
              Email: <span className="font-bold">{currentUser?.email}</span>
            </h2>
            {currentUser?.displayName && (
              <p className="mt-2">
                Nome: <span className="font-bold">{currentUser.displayName}</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/update-profile')}
              variant="outline"
            >
              Aggiorna Profilo
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}