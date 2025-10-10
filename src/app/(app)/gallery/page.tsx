
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { loadData } from '@/lib/storage';
import { ShowcaseItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const { user, username } = useAuth();
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const currencySymbol = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    if (username) {
      try {
        const data = loadData(username);
        if (data && (data.products || data.wigs || data.pastries)) {
           const allItemsFromInventory: ShowcaseItem[] = [
            ...(data.products || []).map(p => ({ ...p, imageUrl: `https://picsum.photos/seed/${p.id}/600/600`, description: '', published: false })),
            ...(data.wigs || []).map(w => ({ id: w.id, name: w.wigDetails, price: w.sellingPrice, imageUrl: `https://picsum.photos/seed/${w.id}/600/600`, description: '', published: false })),
            ...(data.pastries || []).map(p => ({ id: p.id, name: p.name, price: p.unitPrice, imageUrl: `https://picsum.photos/seed/${p.id}/600/600`, description: '', published: false })),
          ];
          setItems(allItemsFromInventory);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error(e);
        setError("Données de l'inventaire corrompues ou introuvables.");
      }
    }
  }, [username]);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Galerie des Marchandises</h1>
          <p className="text-muted-foreground">
            Un aperçu visuel de tous les articles de votre inventaire.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden group flex flex-col">
            <div className="relative w-full aspect-square">
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                layout="fill" 
                objectFit="cover" 
                className="transition-transform duration-300 group-hover:scale-105" 
              />
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => router.push('/showcase-manager')}
              >
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
              </Button>
            </div>
            <CardHeader className="p-3">
              <CardTitle className="text-sm truncate font-semibold" title={item.name}>{item.name}</CardTitle>
              <CardDescription className="font-bold text-primary">
                {(item.price ?? 0).toFixed(2)} {currencySymbol}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
       {items.length === 0 && !error && (
        <div className="text-center py-10 text-muted-foreground mt-8">
            <p>Aucun article à afficher dans la galerie.</p>
            <p className="text-sm">Ajoutez des articles dans la section "Marchandises" pour les voir apparaître ici.</p>
        </div>
        )}
    </div>
  );
}
