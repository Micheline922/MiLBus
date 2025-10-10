
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppData, ShowcaseItem } from "@/lib/data";
import { loadData } from "@/lib/storage";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, username } = useAuth();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);
  
  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setShowcaseItems(data.showcase.filter(item => item.imageUrl && item.name !== "Nouveau Produit"));
    }
  }, [username]);


  if (!showcaseItems) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
                Bonjour, {user?.businessName || user?.username}!
            </h1>
            <p className="text-muted-foreground">
                Voici les produits actuellement mis en avant dans votre vitrine publique.
            </p>
        </div>
        
        {showcaseItems.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {showcaseItems.map(item => (
                  <Card key={item.id} className="overflow-hidden group flex flex-col">
                      <div className="relative w-full aspect-[4/5]">
                         <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <CardHeader className="p-3">
                          <CardTitle className="text-base truncate">{item.name}</CardTitle>
                          <CardDescription className="font-semibold text-primary">{(item.price ?? 0).toFixed(2)} {currency}</CardDescription>
                      </CardHeader>
                  </Card>
              ))}
          </div>
        ) : (
           <Card className="text-center py-20 text-muted-foreground">
              <CardContent>
                  <p className="mb-4">Votre vitrine est vide pour le moment.</p>
                  <Button asChild>
                    <Link href="/gallery">
                        <ShoppingCart className="mr-2 h-4 w-4"/>
                        Commencer à ajouter des produits
                    </Link>
                  </Button>
              </CardContent>
           </Card>
        )}

      </div>
    </>
  );
}
