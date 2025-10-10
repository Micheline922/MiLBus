
'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiChat from '@/components/dashboard/ai-chat';
import { DollarSign, Home, Package, Pencil, ShoppingCart, TrendingUp, FileText, Save, Users, BarChart3, GalleryHorizontal, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import WeeklyAiAnalysis from '@/components/dashboard/weekly-ai-analysis';
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
import EditInventoryForm from '@/components/dashboard/edit-inventory-form';
import { exportInventoryToPDF } from '@/lib/inventory-exporter';
import { useToast } from '@/hooks/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';


type Stats = {
    totalRevenue: { value: string; change: string; };
    sales: { value: string; change: string; };
    stock: { value: string; change: string; };
};


export default function DashboardPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  const inventoryForm = useForm<any>();

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setAppData(data);
      setStats(data.stats);
      inventoryForm.reset({
          products: data.products,
          wigs: data.wigs,
          pastries: data.pastries,
      });
    }
  }, [username, inventoryForm.reset]);
  
  const quickLinks = [
    { href: '/products', icon: <Package />, text: 'Gérer les marchandises' },
    { href: '/sales', icon: <ShoppingCart />, text: 'Enregistrer une vente' },
    { href: '/customers', icon: <Users />, text: 'Gérer les clients' },
    { href: '/reports', icon: <BarChart3 />, text: 'Voir les rapports' },
    { href: '/gallery', icon: <GalleryHorizontal />, text: 'Gérer la vitrine' },
  ];

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
  
  const handleInventorySubmit = (values: { products: Product[], wigs: Wig[], pastries: Pastry[] }) => {
    if (!username || !appData) return;
    
    const updatedData = { 
        ...appData, 
        products: values.products,
        wigs: values.wigs,
        pastries: values.pastries,
    };
    
    setAppData(updatedData);

    saveData(username, 'products', values.products);
    saveData(username, 'wigs', values.wigs);
    saveData(username, 'pastries', values.pastries);
    
    inventoryForm.reset(values);

    toast({
      title: "Inventaire sauvegardé !",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  }
  
  const handleExport = () => {
    if (!appData || !user) return;
    const { products, wigs, pastries } = appData;
    exportInventoryToPDF(products, wigs, pastries, {
        name: user.businessName,
        currency: user.currency,
    });
     toast({
      title: "Exportation réussie",
      description: "L'inventaire a été téléchargé en PDF.",
    });
  };

  if (!appData || !stats) {
    return <div>Chargement des données...</div>;
  }

  const { pastryExpenses, sales } = appData;

  return (
    <>
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
             {quickLinks.map(link => (
                <Link href={link.href} key={link.href} passHref>
                    <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col justify-center">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{link.text}</CardTitle>
                            <div className="text-muted-foreground">{link.icon}</div>
                        </CardHeader>
                    </Card>
                </Link>
             ))}
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
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Gestion de l'Inventaire</CardTitle>
                            <CardDescription>Modifiez directement votre inventaire et sauvegardez les changements.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={handleExport}>
                                <FileText className="mr-2 h-4 w-4" /> Exporter
                            </Button>
                            <Button size="sm" onClick={inventoryForm.handleSubmit(handleInventorySubmit)}>
                                <Save className="mr-2 h-4 w-4" /> Sauvegarder
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <FormProvider {...inventoryForm}>
                        <EditInventoryForm
                          initialValues={{ products: appData.products, wigs: appData.wigs, pastries: appData.pastries }}
                          onSubmit={handleInventorySubmit}
                        />
                    </FormProvider>
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
