

'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppData, ShowcaseItem } from "@/lib/data";
import { loadData } from "@/lib/storage";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Copy, QrCode, Share2, Eye } from "lucide-react";
import Link from "next/link";
import WelcomeTour from "@/components/dashboard/welcome-tour";
import { useToast } from "@/hooks/use-toast";
import QRCodeDialog from "@/components/dashboard/qr-code-dialog";
import SocialShare from "@/components/shared/social-share";

export default function ShowcaseManagementPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [publicUrl, setPublicUrl] = useState('');
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const url = `${window.location.origin}/showcase/${username}`;
      setPublicUrl(url);
    }
  }, [username]);
  
  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);
  
  useEffect(() => {
    if (username) {
      const data = loadData(username);
      setShowcaseItems(data.showcase.filter(item => item.published && item.imageUrl && item.name !== "Nouveau Produit"));
    }
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien vers votre vitrine a été copié dans le presse-papiers.",
    });
  };

  if (!showcaseItems) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <WelcomeTour />
      <QRCodeDialog isOpen={isQrDialogOpen} setIsOpen={setIsQrDialogOpen} url={publicUrl} />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Gérer votre Vitrine Publique
                </h1>
                <p className="text-muted-foreground">
                    C'est ici que vous gérez ce que vos clients voient. Partagez votre boutique et prévisualisez vos produits.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" /> Copier le lien
                </Button>
                 <Button variant="outline" size="sm" onClick={() => setIsQrDialogOpen(true)}>
                    <QrCode className="mr-2 h-4 w-4" /> QR Code
                </Button>
                <SocialShare url={publicUrl} title={`Découvrez la boutique de ${user?.businessName || 'MiLBus'}`} />
                 <Button asChild>
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4"/>
                        Voir la boutique
                    </a>
                </Button>
            </div>
        </div>
        
        {showcaseItems.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  <p className="mb-4">Votre vitrine est vide. Publiez des articles depuis la galerie.</p>
                  <Button asChild>
                    <Link href="/gallery">
                        Aller à la Galerie
                    </Link>
                  </Button>
              </CardContent>
           </Card>
        )}

      </div>
    </>
  );
}
