
'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiChat from '@/components/dashboard/ai-chat';
import { DollarSign, Home, Package, Pencil, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import EditSalesForm from '@/components/dashboard/edit-sales-form';
import PastryExpensesTable from '@/components/dashboard/pastry-expenses-table';
import EditPastryExpensesForm from '@/components/dashboard/edit-pastry-expenses-form';
import ThemeSwitcher from '@/components/settings/theme-switcher';
import { useAuth } from '@/hooks/use-auth';
import { AppData, Product, Wig, Pastry, PastryExpense, Sale } from '@/lib/data';
import { loadData, saveData } from '@/lib/storage';
import WelcomeTour from '@/components/dashboard/welcome-tour';
import EditInventoryForm from '@/components/dashboard/edit-inventory-form';


type Stats = {
    totalRevenue: { value: string; change: string; };
    sales: { value: string; change: string; };
    stock: { value: string; change: string; };
};


export default function DashboardPage() {
  const { user, username } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setAppData(data);
      setStats(data.stats);
    }
  }, [username]);
  
  const monthlySalesData = useMemo(() => {
    if (!appData?.sales) return [];

    const salesByMonth: { [key: string]: number } = {};

    appData.sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleString('fr-FR', { month: 'short' });
      salesByMonth[month] = (salesByMonth[month] || 0) + sale.amount;
    });

    const monthOrder = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

    return monthOrder.map(month => ({
      name: month,
      total: salesByMonth[month] || 0,
    })).filter(d => d.total > 0);

  }, [appData?.sales]);

  const updateData = <K extends keyof AppData>(key: K, value: AppData[K]) => {
    if (!username || !appData) return;
    const updatedData = { ...appData, [key]: value };
    setAppData(updatedData);
    saveData(username, key, value);
    setDialogOpen(prev => ({ ...prev, [key]: false }));
  };

  const handleOpenDialog = (id: string, isOpen: boolean) => {
    setDialogOpen(prev => ({ ...prev, [id]: isOpen }));
  };
  
  const handleStatsSubmit = (values: Stats) => {
    if (!username) return;
    setStats(values);
    saveData(username, 'stats', values);
    handleOpenDialog('stats', false);
  };
  
  const handleInventorySubmit = (values: {products: Product[], wigs: Wig[], pastries: Pastry[]}) => {
    if (!username || !appData) return;
    const { products, wigs, pastries } = values;
    updateData('products', products);
    updateData('wigs', wigs);
    updateData('pastries', pastries);
    handleOpenDialog('inventory', false);
  }

  if (!appData || !stats) {
    return <div>Chargement des données...</div>;
  }

  const { products, wigs, pastries, pastryExpenses, sales } = appData;

  return (
    <>
    <WelcomeTour />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <StatCard 
                  title="Revenus totaux" 
                  value={`${stats.totalRevenue.value} ${currency}`}
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
           <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Vue d'ensemble des Ventes</CardTitle>
                <CardDescription>Évolution de vos revenus mensuels.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value} ${currency}`}
                    />
                    <Tooltip 
                       cursor={{fill: 'hsl(var(--muted))'}}
                       contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className='col-span-full lg:col-span-3 relative group'>
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
              <RecentSales sales={sales} currency={currency} />
            </div>
        </div>
        <div className="grid grid-cols-1 gap-y-4">
            <Card className="relative group">
               <Dialog open={dialogOpen['inventory']} onOpenChange={(isOpen) => handleOpenDialog('inventory', isOpen)}>
                  <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="mr-2 h-4 w-4" /> Modifier l'Inventaire
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Modifier la Gestion de l'Inventaire</DialogTitle>
                       <DialogDescription>
                        Renommez les catégories et modifiez les articles de votre inventaire.
                      </DialogDescription>
                    </DialogHeader>
                    <EditInventoryForm 
                      initialValues={{ products, wigs, pastries }} 
                      onSubmit={handleInventorySubmit} 
                    />
                  </DialogContent>
                </Dialog>
              <CardHeader>
                <CardTitle className="text-xl">Gestion de l'Inventaire</CardTitle>
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
                        <TableCell>{product.purchasePrice?.toFixed(2) ?? 'N/A'} {currency}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>{product.remaining}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <hr className="my-4" />
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
                        <TableCell>{wig.bundlesPrice.toFixed(2)} {currency}</TableCell>
                        <TableCell>{wig.sellingPrice.toFixed(2)} {currency}</TableCell>
                        <TableCell>{wig.sold}</TableCell>
                        <TableCell>{wig.remaining}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 <hr className="my-4" />
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
                          <TableCell>{pastry.unitPrice.toFixed(2)} {currency}</TableCell>
                          <TableCell>{pastry.totalPrice.toFixed(2)} {currency}</TableCell>
                          <TableCell>{pastry.expenses.toFixed(2)} {currency}</TableCell>
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
                <PastryExpensesTable expenses={pastryExpenses} currency={currency} />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <AiChat />
              <WeeklyAiAnalysis />
            </div>

        </div>
      </div>
    </ScrollArea>
    </>
  );
}
