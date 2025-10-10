
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { AppData, Product, ShowcaseItem, Wig, Pastry } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, ImagePlus, Eye, Copy, QrCode, Share2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function GalleryPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const loadShowcaseData = (currentUsername: string) => {
      const data = loadData(currentUsername);

      const allProductsFromInventory: Partial<Product & Wig & Pastry>[] = [
        ...data.products,
        ...data.wigs.map(w => ({ ...w, id: w.id, name: w.wigDetails, price: w.sellingPrice, stock: w.remaining })),
        ...data.pastries.map(p => ({ ...p, id: p.id, name: p.name, price: p.unitPrice, stock: p.remaining })),
      ];
      
      const existingShowcaseData = data.showcase || [];
      const existingShowcaseMap = new Map(existingShowcaseData.map(item => [item.id, item]));

      const synchronizedShowcaseItems: ShowcaseItem[] = allProductsFromInventory.map(p => {
        const existingItem = existingShowcaseMap.get(p.id!);
        return {
          id: p.id!,
          name: existingItem?.name || p.name!,
          price: existingItem?.price ?? p.price ?? (p as any).sellingPrice ?? (p as any).unitPrice,
          imageUrl: existingItem?.imageUrl || `https://picsum.photos/seed/${p.id}/400/300`,
        };
      });
      setShowcaseItems(synchronizedShowcaseItems);
  };

  useEffect(() => {
    if (username) {
      loadShowcaseData(username);
    }
  }, [username]);
  

  const handleItemChange = (id: string, field: keyof Omit<ShowcaseItem, 'imageUrl'>, value: string | number) => {
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
        const result = reader.result as string;
        
        setShowcaseItems(prevItems => {
            if (!prevItems) return null;
            return prevItems.map(item => 
                item.id === itemId ? {...item, imageUrl: result } : item
            );
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!username || !showcaseItems) return;
    
    const itemsToSave = showcaseItems.map(item => {
        const { ...rest } = item;
        if (rest.imageUrl.startsWith('data:image')) {
            rest.imageUrl = `https://picsum.photos/seed/${item.id}/400/300`;
        }
        return rest;
    });

    try {
      saveData(username, 'showcase', itemsToSave);
      toast({
          title: "Galerie mise à jour !",
          description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!showcaseItems) {
    return <div>Chargement de la galerie...</div>;
  }
  
  const currency = user?.currency === 'USD' ? '$' : 'FC';

  return (
    <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-headline font-bold tracking-tight">Galerie</h1>
                    <p className="text-muted-foreground">
                        Gérez ici l'apparence des produits sur la boutique publique.
                    </p>
                </div>
                 <div className="flex items-center space-x-2">
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" /> Sauvegarder la Galerie
                    </Button>
                </div>
            </div>
        
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {showcaseItems.map(item => (
                        <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card>
                                    <CardHeader>
                                        <div className='relative w-full h-64 mb-4 group'>
                                            <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                                            <Button size="sm" variant="secondary" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => fileInputRefs.current[item.id]?.click()}>
                                                <ImagePlus className="mr-2 h-4 w-4" /> Changer
                                            </Button>
                                            <Input 
                                                type="file" 
                                                className="hidden" 
                                                ref={el => fileInputRefs.current[item.id] = el}
                                                onChange={(e) => handleImageChange(e, item.id)}
                                                accept="image/*"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor={`name-${item.id}`}>Nom du produit</Label>
                                            <Input id={`name-${item.id}`} value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`price-${item.id}`}>Prix ({currency})</Label>
                                            <Input id={`price-${item.id}`} type="number" value={item.price} onChange={e => handleItemChange(item.id, 'price', e.target.valueAsNumber || 0)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    </>
  );
}
