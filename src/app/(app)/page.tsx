
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ShoppingCart, Package, Users, BarChart3, GalleryHorizontal } from "lucide-react";
import Link from "next/link";
import { AppData, Sale } from "@/lib/data";
import { loadData } from "@/lib/storage";
import { useEffect, useState, useMemo } from "react";
import WelcomeTour from "@/components/dashboard/welcome-tour";
import RecentSales from "@/components/dashboard/recent-sales";

export default function HomePage() {
  const { user, username } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);
  
  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setAppData(data);
    }
  }, [username]);

  const quickLinks = [
    { href: '/products', icon: <PlusCircle />, text: 'Ajouter un produit' },
    { href: '/sales', icon: <ShoppingCart />, text: 'Enregistrer une vente' },
    { href: '/customers', icon: <Users />, text: 'Gérer les clients' },
    { href: '/reports', icon: <BarChart3 />, text: 'Voir les rapports' },
    { href: '/gallery', icon: <GalleryHorizontal />, text: 'Voir la galerie' },
    { href: '/showcase-manager', icon: <Package />, text: 'Gérer la vitrine' },
  ];

  if (!appData) {
    return <div>Chargement...</div>;
  }
  
  const { sales } = appData;

  return (
    <>
      <WelcomeTour />
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
                Bonjour, {user?.businessName || user?.username}!
            </h1>
            <p className="text-muted-foreground">
                Bienvenue sur votre espace de gestion MiLBus. Voici un résumé et des accès rapides.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {quickLinks.map(link => (
                <Link href={link.href} key={link.href} passHref>
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{link.text}</CardTitle>
                            <div className="text-muted-foreground">{link.icon}</div>
                        </CardHeader>
                    </Card>
                </Link>
             ))}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
             <RecentSales sales={sales} currency={currency} />
        </div>

      </div>
    </>
  );
}
