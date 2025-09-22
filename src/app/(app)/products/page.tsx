
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
import { products as initialProducts, wigs as initialWigs } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import EditProductsForm from "@/components/dashboard/edit-products-form";
import EditWigsForm from "@/components/dashboard/edit-wigs-form";

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [wigs, setWigs] = useState(initialWigs);
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const handleOpenDialog = (id: string, isOpen: boolean) => {
    setDialogOpen(prev => ({ ...prev, [id]: isOpen }));
  };

  const handleProductsSubmit = (values: any) => {
    setProducts(values.products);
    handleOpenDialog('products', false);
  };
  
  const handleWigsSubmit = (values: any) => {
    setWigs(values.wigs);
    handleOpenDialog('wigs', false);
  };

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
    </div>
  );
}


