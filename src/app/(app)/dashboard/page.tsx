'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiInsights from '@/components/dashboard/ai-insights';
import { DollarSign, Package, Pencil, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyAiAnalysis from '@/components/dashboard/weekly-ai-analysis';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products as initialProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditDashboardForm from '@/components/dashboard/edit-dashboard-form';


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
  const [stats, setStats] = useState({
    totalRevenue: { value: '45 231,89 €', change: '+20.1% depuis le mois dernier' },
    sales: { value: '+12,234', change: '+19% depuis le mois dernier' },
    dailySales: { value: '+12', change: '+1 depuis la dernière heure' },
    stock: { value: '105', change: '2 articles en faible stock' },
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFormSubmit = (values: any) => {
    setStats({
      totalRevenue: values.totalRevenue,
      sales: values.sales,
      dailySales: values.dailySales,
      stock: values.stock,
    });
    setChartData(values.chartData);
    setProducts(values.products);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier le tableau de bord
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Personnaliser le tableau de bord</DialogTitle>
              <DialogDescription>
                Modifiez les statistiques et les données du graphique ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <EditDashboardForm
              initialValues={{ ...stats, chartData, products }}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Ventes du jour" 
          value={stats.dailySales.value}
          change={stats.dailySales.change}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Articles en stock" 
          value={stats.stock.value}
          change={stats.stock.change}
          icon={<Package className="h-4 w-4 text-muted-foreground" />} 
        />
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
                  tickFormatter={(value) => `${value}€`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <RecentSales />
      </div>
       <div className="grid gap-4 md:grid-cols-1">
        <Tabs defaultValue="assets">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets">Actifs</TabsTrigger>
            <TabsTrigger value="inventory">Recommandations de Stock</TabsTrigger>
            <TabsTrigger value="weekly">Analyse Hebdomadaire</TabsTrigger>
          </TabsList>
          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Avoirs en Stock</CardTitle>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.purchasePrice?.toFixed(2) ?? 'N/A'}€</TableCell>
                        <TableCell>{product.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inventory">
            <AiInsights />
          </TabsContent>
          <TabsContent value="weekly">
            <WeeklyAiAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
