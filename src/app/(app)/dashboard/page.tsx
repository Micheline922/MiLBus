
'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiChat from '@/components/dashboard/ai-chat';
import { DollarSign, Home, Package, Pencil, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import WeeklyAiAnalysis from '@/components/dashboard/weekly-ai-analysis';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import PastryExpensesTable from '@/components/dashboard/pastry-expenses-table';
import EditPastryExpensesForm from '@/components/dashboard/edit-pastry-expenses-form';
import ThemeSwitcher from '@/components/settings/theme-switcher';
import { useAuth } from '@/hooks/use-auth';
import { AppData, Product, Wig, Pastry, PastryExpense, Sale } from '@/lib/data';
import { loadData, saveData } from '@/lib/storage';


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
  const { username } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);

  const [chartData, setChartData] = useState(initialChartData);
  
  const [stats, setStats] = useState({
    totalRevenue: { value: '45 231,89 FC', change: '+20.1% depuis le mois dernier' },
    sales: { value: '+12,234', change: '+19% depuis le mois dernier' },
    stock: { value: '105', change: '2 articles en faible stock' },
  });

  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setAppData(data);
    }
  }, [username]);

  const updateData = <K extends keyof AppData>(key: K, value: AppData[K]) => {
    if (!username || !appData) return;
    const updatedData = { ...appData, [key]: value };
    setAppData(updatedData);
    saveData(username, key, value);
    handleOpenDialog(key, false);
  };
  
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

  if (!appData) {
    return <div>Chargement des données...</div>;
  }

  const { products, wigs, pastries, pastryExpenses, sales } = appData;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative group col-span-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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
              </div>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className='col-span-4 lg:col-span-7 relative group'>
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
                <EditSalesForm initialValues={{ sales }} onSubmit={(v) => updateData('sales', v.sales)} />
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
                  <EditProductsForm initialValues={{ products }} onSubmit={(v) => updateData('products', v.products)} />
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
                  <EditWigsForm initialValues={{ wigs }} onSubmit={(v) => updateData('wigs', v.wigs)} />
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
                    <EditPastriesForm initialValues={{ pastries }} onSubmit={(v) => updateData('pastries', v.pastries)} />
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

            <div className="relative group">
                <Dialog open={dialogOpen['pastryExpenses']} onOpenChange={(isOpen) => handleOpenDialog('pastryExpenses', isOpen)}>
                  <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Modifier les Dépenses des Pâtisseries</DialogTitle>
                    </DialogHeader>
                    <EditPastryExpensesForm initialValues={{ pastryExpenses }} onSubmit={(v) => updateData('pastryExpenses', v.pastryExpenses)} />
                  </DialogContent>
                </Dialog>
                <PastryExpensesTable expenses={pastryExpenses} />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <AiChat />
              <WeeklyAiAnalysis />
            </div>

        </div>
      </div>
    </ScrollArea>
  );
}
