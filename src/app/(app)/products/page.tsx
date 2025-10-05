
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
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import EditProductsForm from "@/components/dashboard/edit-products-form";
import EditWigsForm from "@/components/dashboard/edit-wigs-form";
import EditPastriesForm from "@/components/dashboard/edit-pastries-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddProductForm from "@/components/dashboard/add-product-form";
import AddWigForm from "@/components/dashboard/add-wig-form";
import AddPastryForm from "@/components/dashboard/add-pastry-form";

type ItemType = 'product' | 'wig' | 'pastry';
type Item = Product | Wig | Pastry;

export default function ProductsPage() {
  const { username } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [wigs, setWigs] = useState<Wig[] | null>(null);
  const [pastries, setPastries] = useState<Pastry[] | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState<Record<string, boolean>>({});
  const [addDialogOpen, setAddDialogOpen] = useState<Record<string, boolean>>({});
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; item: Item | null; type: ItemType | null }>({ isOpen: false, item: null, type: null });

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setProducts(data.products);
      setWigs(data.wigs);
      setPastries(data.pastries);
    }
  }, [username]);
  
  const handleOpenDialog = (type: 'edit' | 'add', id: string, isOpen: boolean) => {
    const setter = type === 'edit' ? setEditDialogOpen : setAddDialogOpen;
    setter(prev => ({ ...prev, [id]: isOpen }));
  };

  const handleDelete = () => {
    if (!username || !deleteAlert.item || !deleteAlert.type) return;

    let updatedItems: Item[] | null = null;
    let storageKey: 'products' | 'wigs' | 'pastries';

    switch (deleteAlert.type) {
        case 'product':
            storageKey = 'products';
            updatedItems = products!.filter(p => p.id !== deleteAlert.item!.id);
            setProducts(updatedItems as Product[]);
            break;
        case 'wig':
            storageKey = 'wigs';
            updatedItems = wigs!.filter(w => w.id !== deleteAlert.item!.id);
            setWigs(updatedItems as Wig[]);
            break;
        case 'pastry':
            storageKey = 'pastries';
            updatedItems = pastries!.filter(p => p.id !== deleteAlert.item!.id);
            setPastries(updatedItems as Pastry[]);
            break;
    }

    if (updatedItems) {
      saveData(username, storageKey, updatedItems);
      toast({
        title: "Succès",
        description: "L'élément a été supprimé.",
      });
    }

    setDeleteAlert({ isOpen: false, item: null, type: null });
  };


  const openDeleteConfirmation = (item: Item, type: ItemType) => {
      setDeleteAlert({ isOpen: true, item, type });
  };


  const handleProductsSubmit = (values: { products: Product[] }) => {
    if (!username) return;
    setProducts(values.products);
    saveData(username, 'products', values.products);
    handleOpenDialog('edit','products', false);
  };
  
  const handleWigsSubmit = (values: { wigs: Wig[] }) => {
    if (!username) return;
    setWigs(values.wigs);
    saveData(username, 'wigs', values.wigs);
    handleOpenDialog('edit', 'wigs', false);
  };

  const handlePastriesSubmit = (values: { pastries: Pastry[] }) => {
    if (!username) return;
    setPastries(values.pastries);
    saveData(username, 'pastries', values.pastries);
    handleOpenDialog('edit', 'pastries', false);
  };
  
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'category'>) => {
    if (!username || !products) return;
    const productToAdd: Product = { ...newProduct, id: `p${products.length + 1}_${Date.now()}`, category: 'Bijoux & Accessoires' };
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    saveData(username, 'products', updatedProducts);
    handleOpenDialog('add','products', false);
  };
  
  const handleAddWig = (newWig: Omit<Wig, 'id'>) => {
    if (!username || !wigs) return;
    const wigToAdd: Wig = { ...newWig, id: `w${wigs.length + 1}_${Date.now()}` };
    const updatedWigs = [...wigs, wigToAdd];
    setWigs(updatedWigs);
    saveData(username, 'wigs', updatedWigs);
    handleOpenDialog('add', 'wigs', false);
  };
  
  const handleAddPastry = (newPastry: Omit<Pastry, 'id'>) => {
    if (!username || !pastries) return;
    const pastryToAdd: Pastry = { ...newPastry, id: `pa${pastries.length + 1}_${Date.now()}` };
    const updatedPastries = [...pastries, pastryToAdd];
    setPastries(updatedPastries);
    saveData(username, 'pastries', updatedPastries);
    handleOpenDialog('add', 'pastries', false);
  };

  if (!products || !wigs || !pastries) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <AlertDialog open={deleteAlert.isOpen} onOpenChange={(isOpen) => setDeleteAlert(prev => ({...prev, isOpen}))}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Cette action est irréversible. L'élément sera définitivement supprimé.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteAlert({isOpen: false, item: null, type: null})}>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Marchandises</h1>
            <p className="text-muted-foreground">Gérez vos marchandises et inventaire.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Choisir une catégorie</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenDialog('add', 'products', true)}>Bijoux & Accessoire</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenDialog('add', 'wigs', true)}>Perruque</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenDialog('add', 'pastries', true)}>Pâtisserie</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

            <Dialog open={addDialogOpen['products']} onOpenChange={(isOpen) => handleOpenDialog('add', 'products', isOpen)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Bijou ou Accessoire</DialogTitle>
                </DialogHeader>
                <AddProductForm onSubmit={handleAddProduct} />
              </DialogContent>
            </Dialog>

            <Dialog open={addDialogOpen['wigs']} onOpenChange={(isOpen) => handleOpenDialog('add', 'wigs', isOpen)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter une Perruque</DialogTitle>
                </DialogHeader>
                <AddWigForm onSubmit={handleAddWig} />
              </DialogContent>
            </Dialog>

            <Dialog open={addDialogOpen['pastries']} onOpenChange={(isOpen) => handleOpenDialog('add', 'pastries', isOpen)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une Pâtisserie</DialogTitle>
                </DialogHeader>
                <AddPastryForm onSubmit={handleAddPastry} />
              </DialogContent>
            </Dialog>
        </div>

        <Card className="relative group">
          <Dialog open={editDialogOpen['products']} onOpenChange={(isOpen) => handleOpenDialog('edit', 'products', isOpen)}>
              <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="mr-2 h-4 w-4" /> Modifier la liste
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog('edit', 'products', true)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => openDeleteConfirmation(product, 'product')}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Dialog open={editDialogOpen['wigs']} onOpenChange={(isOpen) => handleOpenDialog('edit', 'wigs', isOpen)}>
              <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="mr-2 h-4 w-4" /> Modifier la liste
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog('edit', 'wigs', true)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => openDeleteConfirmation(wig, 'wig')}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="relative group">
            <Dialog open={editDialogOpen['pastries']} onOpenChange={(isOpen) => handleOpenDialog('edit', 'pastries', isOpen)}>
              <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="mr-2 h-4 w-4" /> Modifier la liste
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog('edit', 'pastries', true)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => openDeleteConfirmation(pastry, 'pastry')}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
