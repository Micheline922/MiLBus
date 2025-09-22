import StatCard from '@/components/dashboard/stat-card';
import RecentSales from '@/components/dashboard/recent-sales';
import AiInsights from '@/components/dashboard/ai-insights';
import { DollarSign, Package, ShoppingCart, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';


const chartData = [
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
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Tableau de bord</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Revenus totaux" 
          value="$45,231.89" 
          change="+20.1% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Dépenses totales" 
          value="$12,120.45" 
          change="+1.2% from last month"
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Ventes du jour" 
          value="+12" 
          change="+1 since last hour"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Articles en stock" 
          value="105" 
          change="2 items low"
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <RecentSales />
      </div>
       <div className="grid gap-4 md:grid-cols-1">
        <AiInsights />
      </div>
    </div>
  );
}
