
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
import { Eye, ImagePlus, Send, Link as LinkIcon, Copy, PlusCircle, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddProductForm from '@/components/dashboard/add-product-form';
import AddWigForm from '@/components/dashboard/add-wig-form';
import AddPastryForm from '@/components/dashboard/add-pastry-form';
import QRCodeDialog from '@/components/dashboard/qr-code-dialog';


export default function ShowcaseManagerPage() {
  const { username } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [addDialogOpen, setAddDialogOpen] = useState<Record<string, boolean>>({});
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPublicUrl(`${window.location.origin}/showcase/milbus`);
    }
  }, []);

  const loadShowcaseData = (username: string) => {
      const data = loadData(username);
      setAppData(data);

      const allProducts = [
        ...data.products,
        ...data.wigs.map(w => ({ ...w, id: w.id, name: w.wigDetails, price: w.sellingPrice, stock: w.remaining })),
        ...data.pastries.map(p => ({ ...p, id: p.id, name: p.name, price: p.unitPrice, stock: p.remaining })),
      ];

      const existingShowcaseData = data.showcase || [];
      const existingShowcaseMap = new Map(existingShowcaseData.map(item => [item.id, item]));

      const initializedShowcase: ShowcaseItem[] = allProducts.map(p => {
        const existingItem = existingShowcaseMap.get(p.id);
        const originalProduct = (p as any);
        return {
          id: p.id,
          name: existingItem?.name || p.name,
          price: existingItem?.price ?? originalProduct.price ?? originalProduct.sellingPrice ?? originalProduct.unitPrice,
          description: existingItem?.description || `Description pour ${p.name}`,
          imageUrl: existingItem?.imageUrl || `https://picsum.photos/seed/${p.id}/400/300`,
          published: existingItem?.published || false,
        };
      });
      setShowcaseItems(initializedShowcase);
  }

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
  
  const handlePublishChange = (checked: boolean, itemId: string) => {
    handleItemChange(itemId, 'published', checked);
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

  const handleUpdateAndRedirect = () => {
    if (!username || !showcaseItems) return;
    
    saveData(username, 'showcase', showcaseItems);
    
    toast({
        title: "Vitrine mise à jour",
        description: "Vos modifications ont été enregistrées.",
    });

    router.push(`/showcase/milbus`);
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

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'category'>) => {
    if (!username || !appData) return;
    const products = appData.products;
    const productToAdd: Product = { ...newProduct, id: `p${products.length + 1}_${Date.now()}`, category: 'Bijoux & Accessoires' };
    const updatedProducts = [...products, productToAdd];
    saveData(username, 'products', updatedProducts);
    handleOpenDialog('add','products', false);
    loadShowcaseData(username); // Reload data
    toast({ title: "Succès", description: "Produit ajouté."});
  };
  
  const handleAddWig = (newWig: Omit<Wig, 'id'>) => {
    if (!username || !appData) return;
    const wigs = appData.wigs;
    const wigToAdd: Wig = { ...newWig, id: `w${wigs.length + 1}_${Date.now()}` };
    const updatedWigs = [...wigs, wigToAdd];
    saveData(username, 'wigs', updatedWigs);
    handleOpenDialog('add', 'wigs', false);
    loadShowcaseData(username); // Reload data
    toast({ title: "Succès", description: "Perruque ajoutée."});
  };
  
  const handleAddPastry = (newPastry: Omit<Pastry, 'id'>) => {
    if (!username || !appData) return;
    const pastries = appData.pastries;
    const pastryToAdd: Pastry = { ...newPastry, id: `pa${pastries.length + 1}_${Date.now()}` };
    const updatedPastries = [...pastries, pastryToAdd];
    saveData(username, 'pastries', updatedPastries);
    handleOpenDialog('add', 'pastries', false);
    loadShowcaseData(username); // Reload data
    toast({ title: "Succès", description: "Pâtisserie ajoutée."});
  };


  if (!showcaseItems) {
    return <div>Chargement...</div>;
  }

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

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Gérer la Vitrine</h1>
            <p className="text-muted-foreground">
                Choisissez les produits à afficher, puis cliquez sur "Mettre à jour la vitrine".
            </p>
            </div>
            <div className="flex items-center gap-2">
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
                    Générer QR Code
                </Button>
                <Link href={publicUrl} target="_blank" passHref>
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir la page
                    </Button>
                </Link>
                <Button onClick={handleUpdateAndRedirect}>
                    <Send className="mr-2 h-4 w-4" /> Mettre à jour
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
                        <CardDescription>{(item.price ?? 0).toFixed(2)} FC</CardDescription>
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
                                onCheckedChange={checked => handlePublishChange(checked, item.id)}
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
