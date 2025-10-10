
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
import { Save, ImagePlus, Eye, Copy, QrCode, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCodeDialog from '@/components/dashboard/qr-code-dialog';
import SocialShare from '@/components/shared/social-share';


export default function GalleryPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const url = `${window.location.origin}/showcase/${username}`;
      setPublicUrl(url);
    }
  }, [username]);
  
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
          description: existingItem?.description || `Description pour ${p.name}`,
          imageUrl: existingItem?.imageUrl || `https://picsum.photos/seed/${p.id}/400/300`,
          published: existingItem?.published || false,
        };
      });
      setShowcaseItems(synchronizedShowcaseItems);
  };

  useEffect(() => {
    if (username) {
      loadShowcaseData(username);
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
    
    // Create a 'clean' version of showcase items that does not include large image data
    const itemsToSave = showcaseItems.map(item => {
        const { ...rest } = item;
        // Ensure imageUrl is a placeholder if it's a large data URI, to prevent quota errors.
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

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
        toast({
            title: "Lien copié !",
            description: "Le lien public de la boutique a été copié dans le presse-papiers.",
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de copier le lien.",
        });
    });
  };

  if (!showcaseItems) {
    return <div>Chargement de la galerie...</div>;
  }
  
  const currency = user?.currency === 'USD' ? '$' : 'FC';

  return (
    <>
        <QRCodeDialog 
            isOpen={qrCodeDialogOpen} 
            setIsOpen={setQrCodeDialogOpen} 
            url={publicUrl} 
        />
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Partager votre boutique</DialogTitle>
                </DialogHeader>
                <SocialShare url={publicUrl} title="Découvrez ma boutique !" />
            </DialogContent>
        </Dialog>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-headline font-bold tracking-tight">Galerie & Vitrine</h1>
                    <p className="text-muted-foreground">
                        Gérez ici l'apparence et la visibilité de vos produits sur la boutique publique.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" onClick={copyPublicUrl}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copier le lien
                    </Button>
                     <Button variant="outline" onClick={() => setQrCodeDialogOpen(true)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                    </Button>
                     <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Partager
                    </Button>
                    <Button onClick={() => window.open(publicUrl, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir la boutique
                    </Button>
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder la Galerie
                    </Button>
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
                                    <ImagePlus className="mr-2 h-4 w-4" /> Modifier
                                </Button>
                                <Input 
                                    type="file"
                                    ref={el => fileInputRefs.current[item.id] = el}
                                    onChange={(e) => handleImageChange(e, item.id)}
                                    className="hidden"
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
                                <Label htmlFor={`price-${item.id}`}>Prix</Label>
                                <Input id={`price-${item.id}`} type="number" value={item.price} onChange={e => handleItemChange(item.id, 'price', e.target.valueAsNumber || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`description-${item.id}`}>Description</Label>
                                <Textarea id={`description-${item.id}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label htmlFor={`published-${item.id}`}>Publier sur la boutique</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Rendre ce produit visible par les clients.
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
    </>
  );
}
