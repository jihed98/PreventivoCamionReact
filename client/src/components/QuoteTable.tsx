import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { QuoteDetails } from '@/lib/types';
import { useTruck } from '@/context/TruckContext';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function QuoteTable() {
  const { quotes, updateQuoteStatus } = useTruck();
  
  // Sort quotes by created date, newest first
  const sortedQuotes = [...quotes].sort((a, b) => {
    const dateA = a.created ? new Date(a.created).getTime() : 0;
    const dateB = b.created ? new Date(b.created).getTime() : 0;
    return dateB - dateA;
  });
  
  // Show only the latest 3 quotes
  const recentQuotes = sortedQuotes.slice(0, 3);
  
  // Helper function to get status badge
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            Confermato
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            Rifiutato
          </Badge>
        );
      default:
        return (
          <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
            In attesa
          </Badge>
        );
    }
  };
  
  // Helper function to format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: it });
  };
  
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tragitto</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Km</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Costo</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prezzo</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {recentQuotes.length > 0 ? (
            recentQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(quote.created)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {quote.origin} - {quote.destination}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {quote.distance}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  €{quote.totalCost.toFixed(2)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  €{quote.finalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(quote.status)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Nessun preventivo trovato. Crea un nuovo preventivo per iniziare.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
