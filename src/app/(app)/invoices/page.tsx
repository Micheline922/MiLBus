
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, PlusCircle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditInvoicesForm from "@/components/dashboard/edit-invoices-form";
import { Invoice } from "@/lib/data";

const initialInvoices: Invoice[] = [
  { id: 'INV001', orderId: 'o1', customerName: 'Sophie Dubois', date: '2023-10-28', amount: 30.75, status: 'En attente' },
  { id: 'INV002', orderId: 'o2', customerName: 'Marie Claire', date: '2023-10-27', amount: 25.00, status: 'Payée' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInvoicesSubmit = (values: { invoices: Invoice[] }) => {
    setInvoices(values.invoices);
    setDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">Gérez et suivez vos factures.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Créer une facture
        </Button>
      </div>

      <Card className="relative group">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Modifier les Factures</DialogTitle>
              <DialogDescription>
                Mettez à jour les détails de vos factures.
              </DialogDescription>
            </DialogHeader>
            <EditInvoicesForm initialValues={{ invoices }} onSubmit={handleInvoicesSubmit} />
          </DialogContent>
        </Dialog>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
          <CardDescription>
            Suivi de toutes les factures émises.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture N°</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{isClient ? new Date(invoice.date).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{invoice.amount.toFixed(2)} FC</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'Payée' ? 'secondary' : 'outline'}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Télécharger</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
