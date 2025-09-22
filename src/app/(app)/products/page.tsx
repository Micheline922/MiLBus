import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products, wigs } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const allProducts = [
    ...products,
    ...wigs.map(w => ({
      id: w.id,
      name: w.wigDetails,
      category: 'Perruques' as const,
      purchasePrice: w.bundlesPrice,
      price: w.sellingPrice,
      stock: 1, // Assuming each wig is a unique item for now
      profit: w.sellingPrice - w.bundlesPrice,
    }))
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Inventaire des Produits</CardTitle>
          <CardDescription>
            Liste de toutes les marchandises disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
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
              {allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Enregistrer Vente</DropdownMenuItem>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
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
  );
}
