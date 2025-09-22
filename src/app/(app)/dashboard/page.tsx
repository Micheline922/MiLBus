'use client';

import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiInsights from '@/components/dashboard/ai-insights';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyAiAnalysis from '@/components/dashboard/weekly-ai-analysis';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products } from '@/lib/data';


const initialChartData = [
  { name: 'Jan', total: 0 },
  { name: 'Fev', total: 0 },
  { name: 'Mar', total: 0 },
  { name: 'Avr', total: 0 },
  { name: 'Mai', total: 0 },
  { name: 'Jui', total: 0 },
  { name: 'Jui', total: 0 },
  { name: 'Aoû', total: 0 },
  { name: 'Sep', total: 0 },
  { name: 'Oct', total: 0 },
  { name: 'Nov', total: 0 },
  { name: 'Déc', total: 0 },
]

export default function DashboardPage() {
  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    // This should run only on the client
    setChartData([
      { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Fev', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Avr', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mai', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Jui', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Jui', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Aoû', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Déc', total: Math.floor(Math.random() * 5000) + 1000 },
    ]);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Revenus totaux" 
          value="45 231,89 €" 
          change="+20.1% depuis le mois dernier"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard
          title="Ventes"
          value="+12,234"
          change="+19% depuis le mois dernier"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Ventes du jour" 
          value="+12" 
          change="+1 depuis la dernière heure"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Articles en stock" 
          value="105" 
          change="2 articles en faible stock"
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
