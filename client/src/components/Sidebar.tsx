import { Link, useLocation } from 'wouter';
import { Home, Truck, Calculator, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: '/', icon: <Home className="h-5 w-5 mr-3 text-blue-500" />, label: 'Dashboard', active: location === '/' },
    { href: '/truck-parameters', icon: <Truck className="h-5 w-5 mr-3" />, label: 'Parametri Camion', active: location === '/truck-parameters' },
    { href: '/tax-settings', icon: <Calculator className="h-5 w-5 mr-3" />, label: 'Tasse e Regime Fiscale', active: location === '/tax-settings' },
    { href: '/trip-simulation', icon: <Receipt className="h-5 w-5 mr-3" />, label: 'Simulazione Viaggio', active: location === '/trip-simulation' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Preventivo Camion</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className={cn(
              "flex items-center p-2 rounded-lg",
              link.active 
                ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span className="font-medium">PC</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Utente Demo</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">autotrasportatore</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
