
'use client';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Product, Wig, Pastry } from './data';

// Extend the jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function exportInventoryToPDF(
    products: Product[],
    wigs: Wig[],
    pastries: Pastry[],
    businessDetails: { name: string, currency: 'FC' | 'USD' }
) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const currency = businessDetails.currency === 'USD' ? '$' : 'FC';
    const businessName = businessDetails.name;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rapport d'Inventaire - ${businessName}`, 14, 22);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exporté le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    let finalY = 40;

    // Products Table
    if (products.length > 0) {
        const productsColumns = ["Produit", `Prix Achat (${currency})`, `Prix Vente (${currency})`, "Stock", `Bénéfice (${currency})`];
        const productsRows = products.map(p => [
            p.name,
            p.purchasePrice?.toFixed(2) ?? 'N/A',
            p.price.toFixed(2),
            p.stock.toString(),
            p.profit?.toFixed(2) ?? 'N/A'
        ]);
        doc.setFontSize(14);
        doc.text("Bijoux & Accessoires", 14, finalY);
        doc.autoTable({
            startY: finalY + 5,
            head: [productsColumns],
            body: productsRows,
            theme: 'striped',
            headStyles: { fillColor: [34, 34, 34] },
        });
        finalY = doc.autoTable.previous.finalY + 15;
    }

    // Wigs Table
    if (wigs.length > 0) {
        const wigsColumns = ["Article", `Prix Achat (${currency})`, `Prix Vente (${currency})`, "Stock", `Bénéfice (${currency})`];
        const wigsRows = wigs.map(w => [
            w.wigDetails,
            w.bundlesPrice.toFixed(2),
            w.sellingPrice.toFixed(2),
            w.remaining.toString(),
            (w.sellingPrice - w.bundlesPrice).toFixed(2)
        ]);
        doc.setFontSize(14);
        doc.text("Perruques", 14, finalY);
        doc.autoTable({
            startY: finalY + 5,
            head: [wigsColumns],
            body: wigsRows,
            theme: 'striped',
            headStyles: { fillColor: [34, 34, 34] },
        });
        finalY = doc.autoTable.previous.finalY + 15;
    }
    
    // Pastries Table
    if (pastries.length > 0) {
        const pastriesColumns = ["Produit", "Qté Initiale", `Prix Unitaire (${currency})`, "Vendus", "Restants"];
        const pastriesRows = pastries.map(p => [
            p.name,
            p.quantity.toString(),
            p.unitPrice.toFixed(2),
            p.sold.toString(),
            p.remaining.toString()
        ]);
        doc.setFontSize(14);
        doc.text("Pâtisseries", 14, finalY);
        doc.autoTable({
            startY: finalY + 5,
            head: [pastriesColumns],
            body: pastriesRows,
            theme: 'striped',
            headStyles: { fillColor: [34, 34, 34] },
        });
        finalY = doc.autoTable.previous.finalY + 15;
    }


    // Footer
    doc.setFontSize(10);
    doc.text(`Rapport généré par MiLBus`, 14, doc.internal.pageSize.height - 10);
    doc.text("Conçu par Micheline Ntale", 190, doc.internal.pageSize.height - 10, { align: 'right' });

    doc.save(`Inventaire-${new Date().toISOString().split('T')[0]}.pdf`);
}
