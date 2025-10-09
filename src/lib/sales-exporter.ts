
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Sale } from './data';

// Extend the jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function exportSalesToPDF(sales: Sale[], businessDetails: { name: string, currency: 'FC' | 'USD' }) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const currency = businessDetails.currency === 'USD' ? '$' : 'FC';
    const businessName = businessDetails.name;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Historique des Ventes - ${businessName}`, 14, 22);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exporté le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);


    // Table
    const tableColumn = ["Date", "Client", "Produit", "Quantité", `Montant (${currency})`];
    const tableRows = [];

    for (const sale of sales) {
        const row = [
            new Date(sale.date).toLocaleDateString('fr-FR'),
            sale.customerName,
            sale.productName,
            sale.quantity.toString(),
            sale.amount.toFixed(2),
        ];
        tableRows.push(row);
    }
    
    doc.autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [34, 34, 34] },
    });

    // Totals
    const finalY = doc.autoTable.previous.finalY;
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Total des Ventes:", 140, finalY + 15, { align: 'right' });
    doc.text(`${totalSales.toFixed(2)} ${currency}`, 190, finalY + 15, { align: 'right' });
    
    // Footer
    doc.setFontSize(10);
    doc.text(`Rapport généré par MiLBus`, 14, doc.internal.pageSize.height - 10);
    doc.text("Conçu par Micheline Ntale", 190, doc.internal.pageSize.height - 10, { align: 'right' });


    doc.save(`Historique-Ventes-${new Date().toISOString().split('T')[0]}.pdf`);
}
