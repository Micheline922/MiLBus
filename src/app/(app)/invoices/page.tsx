
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
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { downloadInvoice } from "@/lib/invoice-generator";

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (user?.username) {
      const data = loadData(user.username);
      setInvoices(data.invoices);
    }
  }, [user?.username]);

  const handleInvoicesSubmit = (values: { invoices: Invoice[] }) => {
    if (!user?.username) return;
    setInvoices(values.invoices);
    saveData(user.username, 'invoices', values.invoices);
    setDialogOpen(false);
  };
  
  const handleDownload = (invoice: Invoice) => {
    if (!user) return;
    downloadInvoice(invoice, {
        name: user.businessName,
        address: user.businessAddress,
        contact: user.businessContact,
    });
  };

  if (!invoices) {
    return <div>Chargement...</div>;
  }

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
                    <Button variant="outline" size="sm" onClick={() => handleDownload(invoice)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
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
