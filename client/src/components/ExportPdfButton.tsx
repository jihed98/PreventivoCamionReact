import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { QuoteDetails } from '@/lib/types';
import { formatter } from '@/lib/utils';

interface ExportPdfButtonProps {
  quote: QuoteDetails;
}

export default function ExportPdfButton({ quote }: ExportPdfButtonProps) {
  const handleExport = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set title
    doc.setFontSize(20);
    doc.text('Preventivo Trasporto Camion', 105, 15, { align: 'center' });
    
    // Add date and reference number
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString('it-IT');
    doc.text(`Data: ${today}`, 20, 30);
    doc.text(`Rif: ${quote.id || 'N/A'}`, 20, 35);
    
    // Trip details
    doc.setFontSize(14);
    doc.text('Dettagli Viaggio', 20, 45);
    
    doc.setFontSize(10);
    doc.text(`Origine: ${quote.origin}`, 20, 55);
    doc.text(`Destinazione: ${quote.destination}`, 20, 60);
    doc.text(`Distanza: ${quote.distance} km`, 20, 65);
    doc.text(`Ore di viaggio: ${quote.hours} ore`, 20, 70);
    doc.text(`Ore carico/scarico: ${quote.loadUnloadHours} ore`, 20, 75);
    doc.text(`Tipo strada: ${quote.roadType}`, 20, 80);
    
    // Cost breakdown
    doc.setFontSize(14);
    doc.text('Dettaglio Costi', 20, 95);
    
    const fixedCosts = quote.costs.filter(cost => cost.category === 'fixed');
    const variableCosts = quote.costs.filter(cost => cost.category === 'variable');
    
    // Table for fixed costs
    doc.setFontSize(12);
    doc.text('Costi Fissi', 20, 105);
    
    // @ts-ignore (jspdf-autotable is not properly typed)
    doc.autoTable({
      startY: 110,
      head: [['Voce', 'Importo (€)']],
      body: fixedCosts.map(cost => [cost.name, formatter.format(cost.amount).replace('€', '')]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // blue-500
      margin: { left: 20 },
      tableWidth: 170,
    });
    
    // Table for variable costs
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Costi Variabili', 20, finalY);
    
    // @ts-ignore
    doc.autoTable({
      startY: finalY + 5,
      head: [['Voce', 'Importo (€)']],
      body: variableCosts.map(cost => [cost.name, formatter.format(cost.amount).replace('€', '')]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // green-500
      margin: { left: 20 },
      tableWidth: 170,
    });
    
    // Summary
    // @ts-ignore
    const summaryY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Riepilogo Preventivo', 20, summaryY);
    
    // @ts-ignore
    doc.autoTable({
      startY: summaryY + 5,
      body: [
        ['Costo totale', formatter.format(quote.totalCost).replace('€', '')],
        ['Margine (' + quote.marginRate + '%)', formatter.format(quote.margin).replace('€', '')],
        ['Sub-totale', formatter.format(quote.subtotal).replace('€', '')],
        ...(quote.hasVat && quote.vatAmount !== null ? [['IVA (22%)', formatter.format(quote.vatAmount).replace('€', '')]] : []),
        ['PREZZO FINALE', formatter.format(quote.finalPrice).replace('€', '')],
      ],
      theme: 'plain',
      styles: { fontStyle: 'bold' },
      columnStyles: { 
        0: { fontStyle: 'normal', cellWidth: 100 },
        1: { halign: 'right', cellWidth: 70 }
      },
      margin: { left: 20 },
      tableWidth: 170,
    });
    
    // Footer with per-km info
    // @ts-ignore
    const footerY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(`Costo per km: ${formatter.format(quote.costPerKm)}`, 20, footerY);
    doc.text(`Prezzo per km: ${formatter.format(quote.pricePerKm)}`, 20, footerY + 5);
    
    // Add company info
    doc.setFontSize(8);
    doc.text('Preventivo Camion - Sistema di preventivazione per autotrasportatori', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`Preventivo_${quote.origin}_${quote.destination}.pdf`);
  };
  
  return (
    <Button 
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
      onClick={handleExport}
    >
      <FileDown className="h-5 w-5 mr-2" />
      Esporta PDF
    </Button>
  );
}
