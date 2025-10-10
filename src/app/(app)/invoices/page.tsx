
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, PlusCircle, Pencil } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
import AddInvoiceForm, { AddInvoiceFormValues } from "@/components/dashboard/add-invoice-form";
import { useToast } from "@/hooks/use-toast";

export default function InvoicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    setIsClient(true);
    if (user?.username) {
      const data = loadData(user.username);
      setInvoices(data.invoices);
    }
  }, [user?.username]);

  const handleSaveData = (key: 'invoices', value: Invoice[]) => {
    if (!user?.username) return;
    try {
      saveData(user.username, key, value);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('quota')) {
        toast({
          variant: 'destructive',
          title: 'Erreur de Sauvegarde',
          description: "Le stockage local est plein. Impossible de sauvegarder les modifications.",
          duration: 5000,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Une erreur est survenue lors de la sauvegarde.",
          duration: 5000,
        });
        console.error(error);
      }
      return false;
    }
  };

  const handleInvoicesSubmit = (values: { invoices: Invoice[] }) => {
    if (handleSaveData('invoices', values.invoices)) {
      setInvoices(values.invoices);
      setEditDialogOpen(false);
    }
  };
  
  const handleAddInvoice = (values: AddInvoiceFormValues) => {
    if (!user?.username || !invoices) return;
    
    const newInvoice: Invoice = {
      id: `INV${(invoices.length + 1).toString().padStart(3, '0')}_${Date.now()}`,
      orderId: `manual-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...values,
    };

    const updatedInvoices = [...invoices, newInvoice];
    if (handleSaveData('invoices', updatedInvoices)) {
        setInvoices(updatedInvoices);
        setAddDialogOpen(false);
        toast({
          title: "Facture créée !",
          description: `La facture pour ${newInvoice.customerName} a été ajoutée.`,
        });
    }
  };

  const handleDownload = (invoice: Invoice) => {
    if (!user) return;
    downloadInvoice(invoice, {
        name: user.businessName,
        address: user.businessAddress,
        contact: user.businessContact,
        currency: user.currency,
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
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Créer une facture
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle facture</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <AddInvoiceForm onSubmit={handleAddInvoice} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="relative group">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
                  <TableCell>{invoice.amount.toFixed(2)} {currency}</TableCell>
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
