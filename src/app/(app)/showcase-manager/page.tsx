
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
import { Eye, ImagePlus, Copy, PlusCircle, QrCode, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddProductForm from '@/components/dashboard/add-product-form';
import AddWigForm from '@/components/dashboard/add-wig-form';
import AddPastryForm from '@/components/dashboard/add-pastry-form';
import QRCodeDialog from '@/components/dashboard/qr-code-dialog';
import SocialShare from '@/components/shared/social-share';


export default function ShowcaseManagerPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [addDialogOpen, setAddDialogOpen] = useState<Record<string, boolean>>({});
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [tempImageUrls, setTempImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/showcase/${username || 'milbus'}`;
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
  

  const handleOpenDialog = (type: 'add', id: string, isOpen: boolean) => {
    setAddDialogOpen(prev => ({ ...prev, [id]: isOpen }));
  };

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
        setTempImageUrls(prev => ({ ...prev, [itemId]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAndRedirect = () => {
    if (!username || !showcaseItems) return;

    try {
        const itemsToSave = showcaseItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            published: item.published,
            imageUrl: `https://picsum.photos/seed/${item.id}/400/300`,
        }));

      saveData(username, 'showcase', itemsToSave);

      toast({
          title: "Vitrine mise à jour !",
          description: "Vos modifications ont été enregistrées.",
      });
      window.open(publicUrl, '_blank');
    } catch (e: any) {
        console.error("Failed to save showcase data:", e);
        toast({
            variant: "destructive",
            title: "Erreur de sauvegarde",
            description: "Impossible de sauvegarder les données. Le stockage local est peut-être plein.",
        });
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
        toast({
            title: "Lien copié !",
            description: "Le lien public de la vitrine a été copié dans le presse-papiers.",
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

  const handleAddSuccess = () => {
     if(username) {
        loadShowcaseData(username);
     }
  }

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'category'>) => {
    if (!username) return;
    const data = loadData(username);
    const products = data.products;
    const productToAdd: Product = { ...newProduct, id: `p${products.length + 1}_${Date.now()}`, category: 'Bijoux & Accessoires' };
    saveData(username, 'products', [...products, productToAdd]);
    handleOpenDialog('add','products', false);
    handleAddSuccess();
    toast({ title: "Succès", description: "Produit ajouté."});
  };
  
  const handleAddWig = (newWig: Omit<Wig, 'id'>) => {
    if (!username) return;
    const data = loadData(username);
    const wigs = data.wigs;
    const wigToAdd: Wig = { ...newWig, id: `w${wigs.length + 1}_${Date.now()}` };
    saveData(username, 'wigs', [...wigs, wigToAdd]);
    handleOpenDialog('add', 'wigs', false);
    handleAddSuccess();
    toast({ title: "Succès", description: "Perruque ajoutée."});
  };
  
  const handleAddPastry = (newPastry: Omit<Pastry, 'id'>) => {
    if (!username) return;
    const data = loadData(username);
    const pastries = data.pastries;
    const pastryToAdd: Pastry = { ...newPastry, id: `pa${pastries.length + 1}_${Date.now()}` };
    saveData(username, 'pastries', [...pastries, pastryToAdd]);
    handleOpenDialog('add', 'pastries', false);
    handleAddSuccess();
    toast({ title: "Succès", description: "Pâtisserie ajoutée."});
  };


  if (!showcaseItems) {
    return <div>Chargement de la vitrine...</div>;
  }
  
  const currency = user?.currency === 'USD' ? '$' : 'FC';

  return (
    <>
        <Dialog open={addDialogOpen['products']} onOpenChange={(isOpen) => handleOpenDialog('add', 'products', isOpen)}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter un Bijou ou Accessoire</DialogTitle>
            </DialogHeader>
            <AddProductForm onSubmit={handleAddProduct} />
            </DialogContent>
        </Dialog>

        <Dialog open={addDialogOpen['wigs']} onOpenChange={(isOpen) => handleOpenDialog('add', 'wigs', isOpen)}>
            <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Ajouter une Perruque</DialogTitle>
            </DialogHeader>
            <AddWigForm onSubmit={handleAddWig} />
            </DialogContent>
        </Dialog>

        <Dialog open={addDialogOpen['pastries']} onOpenChange={(isOpen) => handleOpenDialog('add', 'pastries', isOpen)}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter une Pâtisserie</DialogTitle>
            </DialogHeader>
            <AddPastryForm onSubmit={handleAddPastry} />
            </DialogContent>
        </Dialog>

        <QRCodeDialog 
            isOpen={qrCodeDialogOpen} 
            setIsOpen={setQrCodeDialogOpen} 
            url={publicUrl} 
        />
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Partager votre vitrine</DialogTitle>
                </DialogHeader>
                <SocialShare url={publicUrl} title="Découvrez ma boutique !" />
            </DialogContent>
        </Dialog>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Gérer la Vitrine</h1>
            <p className="text-muted-foreground">
                Choisissez les produits à afficher, puis cliquez sur "Mettre à jour et voir".
            </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Choisir une catégorie</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenDialog('add', 'products', true)}>Bijoux & Accessoire</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog('add', 'wigs', true)}>Perruque</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog('add', 'pastries', true)}>Pâtisserie</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                <Button onClick={handleUpdateAndRedirect}>
                    <Eye className="mr-2 h-4 w-4" />
                    Mettre à jour et voir
                </Button>
            </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showcaseItems.map(item => {
                const displayImageUrl = tempImageUrls[item.id] || item.imageUrl;
                return (
                    <Card key={item.id}>
                        <CardHeader>
                            <div className='relative w-full h-48 mb-4 group'>
                                <Image src={displayImageUrl} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
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
                            <CardDescription>{(item.price ?? 0).toFixed(2)} {currency}</CardDescription>
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
                )
            })}
        </div>
        </div>
    </>
  );
}
