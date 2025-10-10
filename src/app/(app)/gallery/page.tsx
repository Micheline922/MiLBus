
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import { ShowcaseItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Trash2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MAX_IMAGE_SIZE = 800; // Max width/height for compressed images

function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_IMAGE_SIZE) {
                        height = Math.round((height * MAX_IMAGE_SIZE) / width);
                        width = MAX_IMAGE_SIZE;
                    }
                } else {
                    if (height > MAX_IMAGE_SIZE) {
                        width = Math.round((width * MAX_IMAGE_SIZE) / height);
                        height = MAX_IMAGE_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                // Get the data-URL with JPEG format and a quality level of 0.8
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export default function GalleryPage() {
  const { username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const itemImageFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setShowcaseItems(data.showcase || []);
    }
  }, [username]);

  const handleItemChange = (id: string, field: keyof Omit<ShowcaseItem, 'imageUrl'>, value: string | number) => {
    setShowcaseItems(prev => {
        if (!prev) return null;
        return prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
    });
  };

  const handleItemImageChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file);
        setShowcaseItems(prev => prev ? prev.map(item => item.id === itemId ? { ...item, imageUrl: compressedDataUrl } : item) : null);
      } catch (error) {
        console.error("Image compression failed:", error);
        toast({
          variant: 'destructive',
          title: 'Erreur de compression',
          description: "Impossible de compresser l'image. Veuillez réessayer."
        });
      }
    }
  };
  
  const handleAddNewImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: ShowcaseItem[] = [];
    const filesArray = Array.from(files);

    toast({
      title: `Compression en cours...`,
      description: `Compression de ${filesArray.length} image(s). Veuillez patienter.`
    });

    try {
      for (const [index, file] of filesArray.entries()) {
        const compressedDataUrl = await compressImage(file);
        const newItem: ShowcaseItem = {
          id: `new_${Date.now()}_${index}`,
          name: "Nouveau Produit",
          price: 0,
          imageUrl: compressedDataUrl,
        };
        newItems.push(newItem);
      }
      
      setShowcaseItems(prev => [...(prev || []), ...newItems]);
      toast({
        title: `${filesArray.length} image(s) ajoutée(s)`,
        description: "N'oubliez pas de rendre la galerie publique."
      });

    } catch (error) {
      console.error("Image compression failed during batch upload:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de compression',
        description: "Une erreur est survenue lors de l'ajout des images."
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setShowcaseItems(prev => prev ? prev.filter(item => item.id !== id) : null);
    toast({
        variant: 'destructive',
        title: "Article supprimé",
        description: "L'article a été retiré. Rendez la galerie publique pour confirmer."
    })
  };

  const handlePublish = () => {
    if (!username || !showcaseItems) return;
    saveData(username, 'showcase', showcaseItems);
    toast({
        title: "Galerie rendue publique !",
        description: "Vos modifications sont maintenant visibles sur la page d'accueil.",
        className: "bg-green-500 text-white",
    });
  };
  

  if (!showcaseItems) {
    return <div>Chargement de la galerie...</div>;
  }

  const currency = "FC";

  return (
    <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-headline font-bold tracking-tight">Galerie</h1>
                    <p className="text-muted-foreground">
                        Ajoutez, modifiez et organisez les photos de vos produits pour la vitrine publique.
                    </p>
                </div>
                 <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="mr-2 h-4 w-4" /> Ajouter des images
                    </Button>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAddNewImages}
                        className="hidden"
                        accept="image/*"
                        multiple
                    />
                </div>
            </div>
        
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {showcaseItems.map(item => (
                    <div key={item.id} className="w-full">
                        <Card className="flex flex-col h-full">
                            <div className='relative w-full aspect-square mb-4 group'>
                                <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                                <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => itemImageFileInputRefs.current[item.id]?.click()}>
                                    <ImagePlus className="h-4 w-4" />
                                </Button>
                                <Input 
                                    type="file" 
                                    className="hidden" 
                                    ref={el => itemImageFileInputRefs.current[item.id] = el}
                                    onChange={(e) => handleItemImageChange(e, item.id)}
                                    accept="image/*"
                                />
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive" className="absolute bottom-2 right-2">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action supprimera l'article de la galerie. Cette action est irréversible après publication.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Supprimer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <CardContent className="space-y-4 flex-grow flex flex-col p-3">
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
                ))}
                 {showcaseItems.length === 0 && (
                    <div className="w-full text-center py-20 text-muted-foreground col-span-full">
                        <p>Votre galerie est vide. Ajoutez des images pour commencer.</p>
                    </div>
                )}
            </div>
             <div className="flex justify-center mt-8">
                <Button size="lg" onClick={handlePublish}>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Rendre la galerie publique
                </Button>
            </div>
        </div>
    </>
  );
}
