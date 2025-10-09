import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/lib/data';

export default function RecentSales({ sales, currency }: { sales: Sale[], currency: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ventes Récentes</CardTitle>
        <CardDescription>Vous avez fait {sales.length} ventes ce mois-ci.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://picsum.photos/seed/${sale.customerName.replace(/\s/g, '')}/40/40`} alt="Avatar" />
                <AvatarFallback>{sale.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                <p className="text-sm text-muted-foreground">{sale.productName}</p>
              </div>
              <div className="ml-auto font-medium">+{sale.amount.toFixed(2)} {currency}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
