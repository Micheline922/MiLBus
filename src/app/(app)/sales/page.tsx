
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sale } from "@/lib/data";
import { PlusCircle, FileText, Pencil } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import EditSalesForm from "@/components/dashboard/edit-sales-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import AddSaleForm, { AddSaleFormValues } from "@/components/dashboard/add-sale-form";
import { useToast } from "@/hooks/use-toast";
import { exportSalesToPDF } from "@/lib/sales-exporter";

export default function SalesPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setSales(data.sales);
    }
  }, [username]);
  
  const handleSaveData = (key: 'sales', value: Sale[]) => {
    if (!username) return;
    try {
      saveData(username, key, value);
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

  const handleSalesSubmit = (values: { sales: Sale[] }) => {
    if (handleSaveData('sales', values.sales)) {
      setSales(values.sales);
      setEditDialogOpen(false);
    }
  };
  
  const handleAddSale = (values: AddSaleFormValues) => {
    if (!username || !sales) return;
    
    const newSale: Sale = {
      id: `s${sales.length + 1}_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...values,
    };

    const updatedSales = [...sales, newSale];
    if (handleSaveData('sales', updatedSales)) {
      setSales(updatedSales);
      setAddDialogOpen(false);
      toast({
        title: "Vente enregistrée !",
        description: `La vente de ${newSale.productName} a été ajoutée.`,
      });
    }
  };

  const handleExport = () => {
    if (!sales || !user) return;
    exportSalesToPDF(sales, {
        name: user.businessName,
        currency: user.currency,
    });
     toast({
      title: "Exportation réussie",
      description: "L'historique des ventes a été téléchargé en PDF.",
    });
  }


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
          <Button variant="outline" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" /> Exporter
          </Button>
           <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Enregistrer une vente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer une nouvelle vente</DialogTitle>
                <DialogDescription>
                  Remplissez les informations ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <AddSaleForm onSubmit={handleAddSale} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="relative group">
         <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
