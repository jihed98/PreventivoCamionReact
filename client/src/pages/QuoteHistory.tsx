import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTruck } from '@/context/TruckContext';
import { QuoteDetails } from '@/lib/types';
import { getQueryFn, queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileText, Eye, Check, X, Plus } from 'lucide-react';

export default function QuoteHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { updateQuoteStatus } = useTruck();
  
  // Utilizzo react-query per recuperare i preventivi dal database
  const { data: quotesFromDb, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/quotes'],
    queryFn: getQueryFn({
      on401: 'returnNull',
    }),
  });
  
  // Utilizzo anche i preventivi locali come fallback
  const { quotes: localQuotes } = useTruck();
  
  // Combino i due insiemi di preventivi, dando priorità a quelli dal database
  const allQuotes: QuoteDetails[] = quotesFromDb as QuoteDetails[] || localQuotes;
  
  // Filtra per stato se necessario
  const filteredQuotes = statusFilter 
    ? allQuotes.filter((quote: QuoteDetails) => quote.status === statusFilter)
    : allQuotes;
  
  // Calcola il numero totale di pagine
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  
  // Seleziona i preventivi per la pagina corrente
  const currentQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Assicura che la pagina corrente sia valida
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  
  // Gestisce il cambio di stato di un preventivo
  const handleStatusChange = async (id: number | undefined, status: 'pending' | 'confirmed' | 'rejected') => {
    if (!id) return;
    
    // Aggiorna lo stato localmente
    updateQuoteStatus(id, status);
    
    // Invia l'aggiornamento al server
    try {
      await fetch(`/api/quotes/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      // Aggiorna i dati
      refetch();
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato:', error);
    }
  };
  
  // Helper function per formattare la data
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: it });
  };
  
  // Helper function per ottenere il badge di stato
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
  
  return (
    <Layout 
      title="Cronologia Preventivi"
      action={
        <Link href="/trip-simulation">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Preventivo
          </Button>
        </Link>
      }
    >
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Storia Preventivi
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filtra per stato:</span>
            <Select 
              value={statusFilter || "all"} 
              onValueChange={(value) => {
                setStatusFilter(value === "all" ? null : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tutti i preventivi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="confirmed">Confermati</SelectItem>
                <SelectItem value="rejected">Rifiutati</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Caricamento preventivi...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Errore durante il caricamento dei preventivi.
            </div>
          ) : currentQuotes.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Nessun preventivo trovato. Crea un nuovo preventivo per iniziare.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tragitto</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Km</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Costo</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prezzo</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stato</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {currentQuotes.map((quote: QuoteDetails) => (
                    <TableRow key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(quote.created)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {quote.origin} - {quote.destination}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {quote.distance} km
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
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Link href={`/trip-simulation?quoteId=${quote.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8" title="Visualizza dettagli">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                            onClick={() => handleStatusChange(quote.id, 'confirmed')}
                            disabled={quote.status === 'confirmed'}
                            title="Conferma preventivo"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleStatusChange(quote.id, 'rejected')}
                            disabled={quote.status === 'rejected'}
                            title="Rifiuta preventivo"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}