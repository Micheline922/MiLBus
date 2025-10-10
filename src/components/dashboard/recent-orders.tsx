
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/lib/data';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export default function RecentOrders({ orders, currency }: { orders: Order[], currency: string }) {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Commandes Récentes</CardTitle>
        <CardDescription>
            Vos 5 dernières commandes. Voir toutes les commandes dans la page{' '}
            <Link href="/orders" className="text-primary underline">Commandes</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://picsum.photos/seed/${order.customerName.replace(/\s/g, '')}/40/40`} alt="Avatar" />
                <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.products.join(', ')}</p>
              </div>
              <div className="ml-auto font-medium text-right">
                <p>+{order.totalAmount.toFixed(2)} {currency}</p>
                 <Badge variant={order.status === 'Payée' ? 'secondary' : 'outline'}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

    