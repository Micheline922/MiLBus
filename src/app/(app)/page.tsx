
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppData, ShowcaseItem } from "@/lib/data";
import { loadData } from "@/lib/storage";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Copy, QrCode, Share2, Eye, Star, Quote } from "lucide-react";
import Link from "next/link";
import WelcomeTour from "@/components/dashboard/welcome-tour";
import { useToast } from "@/hooks/use-toast";
import QRCodeDialog from "@/components/dashboard/qr-code-dialog";
import SocialShare from "@/components/shared/social-share";

const testimonials = [
    {
        name: "Marie-Claire K.",
        quote: "La qualité des perruques est incroyable ! Je reçois tellement de compliments. Le service client est également au top. Je recommande à 100%.",
        avatar: "https://picsum.photos/seed/marie-claire/100/100"
    },
    {
        name: "Amina D.",
        quote: "Les bijoux sont magnifiques et uniques. J'ai trouvé le cadeau parfait pour ma sœur. La livraison a été rapide et soignée.",
        avatar: "https://picsum.photos/seed/amina/100/100"
    },
    {
        name: "Sophie M.",
        quote: "Les pâtisseries sont un pur délice ! Les gâteaux sont aussi beaux que bons. Idéal pour toutes les occasions spéciales.",
        avatar: "https://picsum.photos/seed/sophie/100/100"
    }
];

const slogans = [
    "MiLBus - L'élégance qui vous ressemble.",
    "Révélez votre beauté, affirmez votre style.",
    "La qualité au service de votre splendeur.",
    "Plus qu'un produit, une promesse de confiance."
]

export default function ShowcaseManagementPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [publicUrl, setPublicUrl] = useState('');
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const url = `${window.location.origin}/showcase/${username}`;
      setPublicUrl(url);
    }
  }, [username]);
  
  return (
    <>
      <WelcomeTour />
      <QRCodeDialog isOpen={isQrDialogOpen} setIsOpen={setIsQrDialogOpen} url={publicUrl} />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Votre Espace Publicitaire
                </h1>
                <p className="text-muted-foreground">
                    Gérez et partagez votre boutique. Inspirez-vous pour votre communication.
                </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                    toast({ title: "Lien copié !", description: "Le lien vers votre vitrine a été copié." });
                }}>
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
        
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Slogans Publicitaires</CardTitle>
                    <CardDescription>Inspirez-vous de ces accroches pour vos publications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {slogans.map((slogan, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Quote className="h-6 w-6 text-primary" />
                            <p className="font-medium text-lg italic">"{slogan}"</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Témoignages Clients</CardTitle>
                    <CardDescription>La satisfaction de vos clients est votre meilleure publicité.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   {testimonials.map((testimonial, index) => (
                       <div key={index} className="flex items-start gap-4">
                           <Avatar>
                               <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                               <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="font-semibold">{testimonial.name}</p>
                               <div className="flex items-center gap-0.5 text-yellow-500">
                                   {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                               </div>
                               <p className="text-sm text-muted-foreground mt-1">"{testimonial.quote}"</p>
                           </div>
                       </div>
                   ))}
                </CardContent>
            </Card>
        </div>

      </div>
    </>
  );
}
