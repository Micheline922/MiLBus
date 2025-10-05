
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { AppData, Product, ShowcaseItem, Wig, Pastry } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Eye, ImagePlus } from 'lucide-react';
import Link from 'next/link';

export default function ShowcaseManagerPage() {
  const { username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      // Initialize showcase items from products, wigs, and pastries
      const allProducts = [
          ...data.products, 
          ...data.wigs.map(w => ({...w, name: w.wigDetails, price: w.sellingPrice})), 
          ...data.pastries.map(p => ({...p, price: p.unitPrice}))
      ];
      
      const initializedShowcase: ShowcaseItem[] = allProducts.map(p => {
          const existingItem = data.showcase?.find(item => item.id === p.id);
          return {
              id: p.id,
              name: existingItem?.name || p.name,
              price: p.price,
              description: existingItem?.description || `Description pour ${p.name}`,
              imageUrl: existingItem?.imageUrl || `https://picsum.photos/seed/${p.id}/400/400`,
              published: existingItem?.published || false,
          };
      });

      setShowcaseItems(initializedShowcase);
    }
  }, [username]);

  const handleItemChange = (id: string, field: keyof ShowcaseItem, value: string | boolean | number) => {
    if (!showcaseItems) return;
    const updatedItems = showcaseItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setShowcaseItems(updatedItems);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleItemChange(itemId, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!username || !showcaseItems) return;
    saveData(username, 'showcase', showcaseItems);
    toast({
        title: "Vitrine mise à jour",
        description: "Vos modifications ont été enregistrées.",
    });
  };

  if (!showcaseItems) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Gérer la Vitrine</h1>
          <p className="text-muted-foreground">
            Choisissez les produits à afficher sur votre page publique.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Link href={`/showcase?user=${username}`} target="_blank" passHref>
                <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir la page publique
                </Button>
            </Link>
            <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcaseItems.map(item => (
            <Card key={item.id}>
                <CardHeader>
                    <div className='relative w-full h-48 mb-4 group'>
                        <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                         <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => fileInputRefs.current[item.id]?.click()}
                         >
                            <ImagePlus className="mr-2 h-4 w-4" /> Modifier l'image
                        </Button>
                        <Input 
                            type="file"
                            ref={el => fileInputRefs.current[item.id] = el}
                            onChange={(e) => handleImageChange(e, item.id)}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.price.toFixed(2)} FC</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor={`name-${item.id}`}>Nom du produit</Label>
                        <Input id={`name-${item.id}`} value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`description-${item.id}`}>Description</Label>
                        <Textarea id={`description-${item.id}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor={`published-${item.id}`}>Publier</Label>
                            <p className="text-xs text-muted-foreground">
                                Rendre ce produit visible sur la page publique.
                            </p>
                        </div>
                        <Switch
                            id={`published-${item.id}`}
                            checked={item.published}
                            onCheckedChange={checked => handleItemChange(item.id, 'published', checked)}
                        />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
