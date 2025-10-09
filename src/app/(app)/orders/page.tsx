
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Pencil, FileText, Mail } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import EditOrdersForm from "@/components/dashboard/edit-orders-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { useToast } from "@/hooks/use-toast";
import { generateInvoiceFromOrder } from "@/lib/invoice-generator";

export default function OrdersPage() {
  const { user, username } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setOrders(data.orders);
    }
  }, [username]);

  const handleOrdersSubmit = (values: { orders: Order[] }) => {
    if (!username) return;
    setOrders(values.orders);
    saveData(username, 'orders', values.orders);
    setDialogOpen(false);
  };
  
  const handleGenerateInvoice = (order: Order) => {
    if (!username) return;

    const appData = loadData(username);
    const newInvoice = generateInvoiceFromOrder(order, appData.invoices.length);
    const updatedInvoices = [...appData.invoices, newInvoice];
    saveData(username, 'invoices', updatedInvoices);
    
    toast({
        title: "Facture générée !",
        description: `La facture ${newInvoice.id} a été créée pour la commande de ${order.customerName}.`,
    });
  };

  const handleContactByEmail = (order: Order) => {
    if (!order.customerEmail) {
      toast({
        variant: "destructive",
        title: "E-mail manquant",
        description: "Ce client n'a pas d'adresse e-mail enregistrée.",
      });
      return;
    }
    const subject = `Question concernant votre commande N°${order.id}`;
    window.location.href = `mailto:${order.customerEmail}?subject=${encodeURIComponent(subject)}`;
  };


  if (!orders) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">Gérez les commandes de vos clients.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une commande
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
              <DialogTitle>Modifier les Commandes</DialogTitle>
              <DialogDescription>
                Mettez à jour les détails des commandes de vos clients.
              </DialogDescription>
            </DialogHeader>
            <EditOrdersForm initialValues={{ orders }} onSubmit={handleOrdersSubmit} />
          </DialogContent>
        </Dialog>
        <CardHeader>
          <CardTitle>Liste des Commandes</CardTitle>
          <CardDescription>
            Suivi des commandes en cours et passées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact (tél.)</TableHead>
                <TableHead>Email Client</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Montant Total</TableHead>
                <TableHead>Montant Payé</TableHead>
                <TableHead>Reste à Payer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead  className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>{order.products.join(', ')}</TableCell>
                  <TableCell>{order.totalAmount.toFixed(2)} {currency}</TableCell>
                  <TableCell>{order.paidAmount.toFixed(2)} {currency}</TableCell>
                  <TableCell className="font-medium">{order.remainingAmount.toFixed(2)} {currency}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Payée' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateInvoice(order)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Facturer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleContactByEmail(order)} disabled={!order.customerEmail}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contacter
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
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
