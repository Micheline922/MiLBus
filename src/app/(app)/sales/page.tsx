
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sale } from "@/lib/data";
import { PlusCircle, FileText, Pencil } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditSalesForm from "@/components/dashboard/edit-sales-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';

export default function SalesPage() {
  const { user, username } = useAuth();
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setSales(data.sales);
    }
  }, [username]);

  const handleSalesSubmit = (values: { sales: Sale[] }) => {
    if (!username) return;
    setSales(values.sales);
    saveData(username, 'sales', values.sales);
    setDialogOpen(false);
  };

  if (!sales) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Ventes</h1>
          <p className="text-muted-foreground">Enregistrez et consultez l'historique de vos ventes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Enregistrer une vente
          </Button>
        </div>
      </div>

      <Card className="relative group">
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Modifier l'Historique des Ventes</DialogTitle>
            </DialogHeader>
            <EditSalesForm initialValues={{ sales }} onSubmit={handleSalesSubmit} />
          </DialogContent>
        </Dialog>

        <CardHeader>
          <CardTitle>Historique des Ventes</CardTitle>
          <CardDescription>
            Liste de toutes les transactions enregistrées.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.customerName}</TableCell>
                  <TableCell>{sale.productName}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{isClient ? new Date(sale.date).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="text-right">{sale.amount.toFixed(2)} {currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
