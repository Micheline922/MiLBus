
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Invoice, Order } from './data';
import { useAuth } from '@/hooks/use-auth';

// Extend the jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function generateInvoiceFromOrder(order: Order, invoiceCount: number): Invoice {
    const newInvoiceId = `INV${(invoiceCount + 1).toString().padStart(3, '0')}`;
    return {
        id: newInvoiceId,
        orderId: order.id,
        customerName: order.customerName,
        date: new Date().toISOString().split('T')[0],
        amount: order.totalAmount,
        status: order.status === 'Payée' ? 'Payée' : 'En attente',
        // We can add order details here for the PDF generation
        _order: order,
    };
}

export function downloadInvoice(invoice: Invoice, businessDetails?: { name: string, address: string, contact: string, currency: 'FC' | 'USD' }) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const currency = businessDetails?.currency === 'USD' ? '$' : 'FC';
    const businessName = businessDetails?.name || "MiLBus - Beauté & Style";
    const businessAddress = businessDetails?.address || "Votre Adresse, Votre Ville";
    const businessContact = businessDetails?.contact || "contact@milbus.com";

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(businessName, 14, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(businessAddress, 14, 30);
    doc.text(businessContact, 14, 35);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("FACTURE", 190, 22, { align: 'right' });

    // Invoice Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Facture N°: ${invoice.id}`, 190, 35, { align: 'right' });
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 190, 42, { align: 'right' });

    // Client Info
    doc.setFont('helvetica', 'bold');
    doc.text("Facturé à :", 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customerName, 14, 62);
    if(invoice._order?.customerEmail) {
        doc.text(invoice._order.customerEmail, 14, 69);
    }
    if(invoice._order?.customerPhone) {
        doc.text(invoice._order.customerPhone, 14, 76);
    }
    
    // Status Badge
    doc.setFont('helvetica', 'bold');
    const status = invoice.status.toUpperCase();
    const isPaid = status === 'PAYÉE';
    doc.setTextColor(isPaid ? 76 : 156, isPaid ? 175 : 163, isPaid ? 80 : 175); // Green for paid, gray for pending
    doc.text(status, 190, 70, { align: 'right' });
    doc.setTextColor(0, 0, 0);


    // Table
    const tableColumn = ["Produit", "Quantité", `Prix Unitaire (${currency})`, `Total (${currency})`];
    const tableRows = [];

    // Assuming we have product details in the _order object attached to the invoice
    if (invoice._order) {
        // A bit of a simplification: we'll create one row per product string
        // In a real app, you'd have quantities and prices per product.
        const productMap = new Map<string, number>();
        invoice._order.products.forEach(p => {
            productMap.set(p, (productMap.get(p) || 0) + 1);
        });

        // Heuristic to guess unit price
        const totalItems = Array.from(productMap.values()).reduce((a, b) => a + b, 0);
        const averagePrice = totalItems > 0 ? invoice.amount / totalItems : invoice.amount;


        for (const [productName, quantity] of productMap.entries()) {
            const row = [
                productName,
                quantity.toString(),
                `${averagePrice.toFixed(2)}`,
                `${(averagePrice * quantity).toFixed(2)}`
            ];
            tableRows.push(row);
        }

    } else {
        // Fallback if no order details
        const row = [
            "Articles divers",
            "1",
            `${invoice.amount.toFixed(2)}`,
            `${invoice.amount.toFixed(2)}`
        ];
        tableRows.push(row);
    }
    
    doc.autoTable({
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [34, 34, 34] },
    });

    // Totals
    const finalY = doc.autoTable.previous.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Total", 140, finalY + 15);
    doc.text(`${invoice.amount.toFixed(2)} ${currency}`, 190, finalY + 15, { align: 'right' });
    
    if (invoice._order) {
        doc.setFont('helvetica', 'normal');
        doc.text("Montant Payé", 140, finalY + 22);
        doc.text(`${invoice._order.paidAmount.toFixed(2)} ${currency}`, 190, finalY + 22, { align: 'right' });
        
        doc.setFont('helvetica', 'bold');
        doc.text("Reste à Payer", 140, finalY + 29);
        doc.text(`${invoice._order.remainingAmount.toFixed(2)} ${currency}`, 190, finalY + 29, { align: 'right' });
    }

    // Footer
    doc.setFontSize(10);
    doc.text("Merci de votre confiance !", 14, doc.internal.pageSize.height - 20);
    doc.text("Conçu par Micheline Ntale", 190, doc.internal.pageSize.height - 10, { align: 'right' });


    doc.save(`Facture-${invoice.id}.pdf`);
}
