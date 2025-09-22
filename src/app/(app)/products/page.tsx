
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, Wig, Pastry } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import EditProductsForm from "@/components/dashboard/edit-products-form";
import EditWigsForm from "@/components/dashboard/edit-wigs-form";
import EditPastriesForm from "@/components/dashboard/edit-pastries-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';

export default function ProductsPage() {
  const { username } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [wigs, setWigs] = useState<Wig[] | null>(null);
  const [pastries, setPastries] = useState<Pastry[] | null>(null);

  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setProducts(data.products);
      setWigs(data.wigs);
      setPastries(data.pastries);
    }
  }, [username]);

  const handleOpenDialog = (id: string, isOpen: boolean) => {
    setDialogOpen(prev => ({ ...prev, [id]: isOpen }));
  };

  const handleProductsSubmit = (values: { products: Product[] }) => {
    if (!username) return;
    setProducts(values.products);
    saveData(username, 'products', values.products);
    handleOpenDialog('products', false);
  };
  
  const handleWigsSubmit = (values: { wigs: Wig[] }) => {
    if (!username) return;
    setWigs(values.wigs);
    saveData(username, 'wigs', values.wigs);
    handleOpenDialog('wigs', false);
  };

  const handlePastriesSubmit = (values: { pastries: Pastry[] }) => {
    if (!username) return;
    setPastries(values.pastries);
    saveData(username, 'pastries', values.pastries);
    handleOpenDialog('pastries', false);
  };

  if (!products || !wigs || !pastries) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Marchandises</h1>
          <p className="text-muted-foreground">Gérez vos marchandises et inventaire.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <Card className="relative group">
        <Dialog open={dialogOpen['products']} onOpenChange={(isOpen) => handleOpenDialog('products', isOpen)}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Modifier les Avoirs - Bijoux & Accessoires</DialogTitle>
              </DialogHeader>
              <EditProductsForm initialValues={{ products }} onSubmit={handleProductsSubmit} />
            </DialogContent>
        </Dialog>
        <CardHeader>
          <CardTitle>Bijoux & Accessoires</CardTitle>
          <CardDescription>
            Liste de vos bijoux et accessoires en stock.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Prix d'Achat</TableHead>
                <TableHead>Prix de Vente</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Bénéfice</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.purchasePrice?.toFixed(2) ?? 'N/A'} FC</TableCell>
                  <TableCell>{product.price.toFixed(2)} FC</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.profit?.toFixed(2) ?? 'N/A'} FC</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 5 ? 'secondary' : product.stock > 0 ? 'outline' : 'destructive'} 
                           className={product.stock > 5 ? 'text-green-700 border-green-300' : product.stock > 0 ? 'text-orange-600 border-orange-300' : ''}>
                      {product.stock > 5 ? 'En stock' : product.stock > 0 ? 'Stock faible' : 'En rupture'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="relative group">
         <Dialog open={dialogOpen['wigs']} onOpenChange={(isOpen) => handleOpenDialog('wigs', isOpen)}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Modifier les Avoirs - Perruques</DialogTitle>
              </DialogHeader>
              <EditWigsForm initialValues={{ wigs }} onSubmit={handleWigsSubmit} />
            </DialogContent>
          </Dialog>
        <CardHeader>
          <CardTitle>Perruques</CardTitle>
          <CardDescription>
            Liste de vos perruques confectionnées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Détails Perruque</TableHead>
                <TableHead>Prix d'Achat</TableHead>
                <TableHead>Prix de Vente</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Bénéfice</TableHead>
                 <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wigs.map((wig) => (
                <TableRow key={wig.id}>
                  <TableCell className="font-medium">{wig.wigDetails}</TableCell>
                  <TableCell>{wig.bundlesPrice.toFixed(2)} FC</TableCell>
                  <TableCell>{wig.sellingPrice.toFixed(2)} FC</TableCell>
                  <TableCell>{wig.remaining}</TableCell>
                   <TableCell>{(wig.sellingPrice - wig.bundlesPrice).toFixed(2)} FC</TableCell>
                  <TableCell>
                    <Badge variant={wig.remaining > 0 ? 'secondary' : 'destructive'} 
                           className={wig.remaining > 0 ? 'text-green-700 border-green-300' : ''}>
                      {wig.remaining > 0 ? 'En stock' : 'En rupture'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="relative group">
          <Dialog open={dialogOpen['pastries']} onOpenChange={(isOpen) => handleOpenDialog('pastries', isOpen)}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Modifier la Gestion des Pâtisseries</DialogTitle>
              </DialogHeader>
              <EditPastriesForm initialValues={{ pastries }} onSubmit={handlePastriesSubmit} />
            </DialogContent>
          </Dialog>
        <CardHeader>
          <CardTitle>Pâtisseries</CardTitle>
          <CardDescription>
            Suivi des ventes de beignets, crêpes, gâteaux et gaufres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité Initiale</TableHead>
                <TableHead>Prix Unitaire</TableHead>
                <TableHead>Quantités Vendues</TableHead>
                <TableHead>Quantités Restantes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastries.map((pastry) => (
                <TableRow key={pastry.id}>
                  <TableCell className="font-medium">{pastry.name}</TableCell>
                  <TableCell>{pastry.quantity}</TableCell>
                  <TableCell>{pastry.unitPrice.toFixed(2)} FC</TableCell>
                  <TableCell>{pastry.sold}</TableCell>
                  <TableCell>{pastry.remaining}</TableCell>
                   <TableCell>
                    <Badge variant={pastry.remaining > 5 ? 'secondary' : pastry.remaining > 0 ? 'outline' : 'destructive'} 
                           className={pastry.remaining > 5 ? 'text-green-700 border-green-300' : pastry.remaining > 0 ? 'text-orange-600 border-orange-300' : ''}>
                      {pastry.remaining > 5 ? 'En stock' : pastry.remaining > 0 ? 'Stock faible' : 'En rupture'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
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
