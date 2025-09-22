
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sales as initialSales } from "@/lib/data";
import { PlusCircle, FileText, Pencil } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditSalesForm from "@/components/dashboard/edit-sales-form";

export default function SalesPage() {
  const [sales, setSales] = useState(initialSales);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSalesSubmit = (values: { sales: typeof initialSales }) => {
    setSales(values.sales);
    setDialogOpen(false);
  };

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
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{sale.amount.toFixed(2)} FC</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
