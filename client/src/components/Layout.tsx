import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export default function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ThemeToggle />
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Preventivo Camion</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 pb-16 md:pb-6">
          {(title || action) && (
            <div className="flex justify-between items-center mb-6">
              {title && <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>}
              {action && action}
            </div>
          )}
          {children}
        </main>
        
        <MobileNavigation />
        <Toaster />
      </div>
    </div>
  );
}
