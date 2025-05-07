import { Link, useLocation } from 'wouter';
import { Home, Truck, Calculator, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNavigation() {
  const [location] = useLocation();

  const links = [
    { href: '/', icon: <Home className="h-6 w-6" />, label: 'Dashboard', active: location === '/' },
    { href: '/truck-parameters', icon: <Truck className="h-6 w-6" />, label: 'Parametri', active: location === '/truck-parameters' },
    { href: '/tax-settings', icon: <Calculator className="h-6 w-6" />, label: 'Tasse', active: location === '/tax-settings' },
    { href: '/trip-simulation', icon: <Receipt className="h-6 w-6" />, label: 'Viaggio', active: location === '/trip-simulation' },
  ];

  return (
    <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center py-3 px-4",
              link.active 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
