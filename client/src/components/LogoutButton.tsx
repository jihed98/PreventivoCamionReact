import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  
  async function handleLogout() {
    try {
      setLoading(true);
      await logout();
      setLocation('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Button 
      onClick={handleLogout} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Uscita...' : 'Logout'}
    </Button>
  );
}