
'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiChat from '@/components/dashboard/ai-chat';
import { DollarSign, Package, Pencil, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import WeeklyAiAnalysis from '@/components/dashboard/weekly-ai-analysis';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products as initialProducts, sales as initialSales, customers as initialCustomers, wigs as initialWigs, pastries as initialPastries } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditStatsForm from '@/components/dashboard/edit-stats-form';
import EditProductsForm from '@/components/dashboard/edit-products-form';
import EditWigsForm from '@/components/dashboard/edit-wigs-form';
import EditPastriesForm from '@/components/dashboard/edit-pastries-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditSalesForm from '@/components/dashboard/edit-sales-form';


const initialChartData = [
  { name: 'Jan', total: 1200 },
  { name: 'Fev', total: 1800 },
  { name: 'Mar', total: 1500 },
  { name: 'Avr', total: 2200 },
  { name: 'Mai', total: 2500 },
  { name: 'Jui', total: 2100 },
  { name: 'Jui', total: 2800 },
  { name: 'Aoû', total: 3200 },
  { name: 'Sep', total: 3000 },
  { name: 'Oct', total: 3500 },
  { name: 'Nov', total: 4000 },
  { name: 'Déc', total: 4500 },
];

export default function DashboardPage() {
  const [chartData, setChartData] = useState(initialChartData);
  const [products, setProducts] = useState(initialProducts);
  const [wigs, setWigs] = useState(initialWigs);
  const [pastries, setPastries] = useState(initialPastries);
  const [sales, setSales] = useState(initialSales);
  const [customers, setCustomers] = useState(initialCustomers);
  const [stats, setStats] = useState({
    totalRevenue: { value: '45 231,89 FC', change: '+20.1% depuis le mois dernier' },
    sales: { value: '+12,234', change: '+19% depuis le mois dernier' },
    stock: { value: '105', change: '2 articles en faible stock' },
  });

  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const handleOpenDialog = (id: string, isOpen: boolean) => {
    setDialogOpen(prev => ({ ...prev, [id]: isOpen }));
  };

  const handleStatsSubmit = (values: any) => {
    setStats(prev => ({
      ...prev,
      totalRevenue: values.totalRevenue,
      stock: values.stock,
    }));
    handleOpenDialog('stats', false);
  };
  
  const handleProductsSubmit = (values: any) => {
    setProducts(values.products);
    handleOpenDialog('products', false);
  };
  
  const handleWigsSubmit = (values: any) => {
    setWigs(values.wigs);
    handleOpenDialog('wigs', false);
  };

  const handlePastriesSubmit = (values: any) => {
    setPastries(values.pastries);
    handleOpenDialog('pastries', false);
  };

  const handleSalesSubmit = (values: any) => {
    setSales(values.sales);
    handleOpenDialog('sales', false);
  }


  return (
    <ScrollArea className="h-[calc(100vh-52px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative group">
              <Dialog open={dialogOpen['stats']} onOpenChange={(isOpen) => handleOpenDialog('stats', isOpen)}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="mr-2 h-4 w-4" /> Modifier
                    </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier les Statistiques</DialogTitle>
                    <DialogDescription>
                      Mettez à jour les cartes de statistiques principales.
                    </DialogDescription>
                  </DialogHeader>
                  <EditStatsForm initialValues={stats} onSubmit={handleStatsSubmit} />
                </DialogContent>
              </Dialog>
               <StatCard 
                title="Revenus totaux" 
                value={stats.totalRevenue.value}
                change={stats.totalRevenue.change}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
              />
              <StatCard
                title="Ventes"
                value={stats.sales.value}
                change={stats.sales.change}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard 
                title="Articles en stock" 
                value={stats.stock.value}
                change={stats.stock.change}
                icon={<Package className="h-4 w-4 text-muted-foreground" />} 
              />
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Aperçu des ventes</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} FC`}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className='col-span-4 lg:col-span-3 relative group'>
            <Dialog open={dialogOpen['sales']} onOpenChange={(isOpen) => handleOpenDialog('sales', isOpen)}>
              <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="mr-2 h-4 w-4" /> Modifier
                  </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Modifier les Ventes Récentes</DialogTitle>
                </DialogHeader>
                <EditSalesForm initialValues={{ sales }} onSubmit={handleSalesSubmit} />
              </DialogContent>
            </Dialog>
            <RecentSales sales={sales} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-4">
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
                <CardTitle className="text-xl">Avoirs en Stock - Bijoux & Accessoires</CardTitle>
                <CardDescription>
                  Liste de vos marchandises actuellement en stock.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Prix d'Achat</TableHead>
                      <TableHead>Quantité en Stock</TableHead>
                      <TableHead>Quantités Vendues</TableHead>
                      <TableHead>Quantités Restantes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.purchasePrice?.toFixed(2) ?? 'N/A'} FC</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>{product.remaining}</TableCell>
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
                <CardTitle  className="text-xl">Avoirs en Stock - Perruques</CardTitle>
                <CardDescription>
                  Détails de vos perruques confectionnées.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mèches Achetées</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>Couleurs</TableHead>
                      <TableHead>Détails Perruque</TableHead>
                      <TableHead>Prix des Mèches</TableHead>
                      <TableHead>Prix de Vente</TableHead>
                       <TableHead>Quantités Vendues</TableHead>
                      <TableHead>Quantités Restantes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wigs.map((wig) => (
                      <TableRow key={wig.id}>
                        <TableCell>{wig.purchasedBundles}</TableCell>
                        <TableCell>{wig.brand}</TableCell>
                        <TableCell>{wig.colors}</TableCell>
                        <TableCell>{wig.wigDetails}</TableCell>
                        <TableCell>{wig.bundlesPrice.toFixed(2)} FC</TableCell>
                        <TableCell>{wig.sellingPrice.toFixed(2)} FC</TableCell>
                        <TableCell>{wig.sold}</TableCell>
                        <TableCell>{wig.remaining}</TableCell>
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
                  <CardTitle className="text-xl">Gestion des Pâtisseries</CardTitle>
                  <CardDescription>
                    Suivi des ventes de beignets, crêpes et gâteaux.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité Initiale</TableHead>
                        <TableHead>Prix Unitaire</TableHead>
                        <TableHead>Prix Total</TableHead>
                        <TableHead>Dépenses</TableHead>
                         <TableHead>Quantités Vendues</TableHead>
                        <TableHead>Quantités Restantes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastries.map((pastry) => (
                        <TableRow key={pastry.id}>
                          <TableCell className="font-medium">{pastry.name}</TableCell>
                          <TableCell>{pastry.quantity}</TableCell>
                          <TableCell>{pastry.unitPrice.toFixed(2)} FC</TableCell>
                          <TableCell>{pastry.totalPrice.toFixed(2)} FC</TableCell>
                          <TableCell>{pastry.expenses.toFixed(2)} FC</TableCell>
                           <TableCell>{pastry.sold}</TableCell>
                          <TableCell>{pastry.remaining}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <AiChat />
              <WeeklyAiAnalysis />
            </div>

        </div>
      </div>
    </ScrollArea>
  );
}

    

    