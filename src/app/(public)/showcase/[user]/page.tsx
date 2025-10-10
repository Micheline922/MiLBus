
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, Suspense, useMemo } from 'react';
import { loadData } from '@/lib/storage';
import { ShowcaseItem, AppData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Cart from '@/components/shared/cart';
import { Separator } from '@/components/ui/separator';
import SocialShare from '@/components/shared/social-share';

function MilbusLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 80C20 80 30 20 50 20C70 20 80 80 80 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 80C35 80 40 50 50 50C60 50 65 80 65 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 50V35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M42 25L50 35L58 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function ShowcaseContent() {
    const router = useRouter();
    const params = useParams();
    const [items, setItems] = useState<ShowcaseItem[]>([]);
    const [businessName, setBusinessName] = useState("MiLBus");
    const [currency, setCurrency] = useState('FC');
    const [error, setError] = useState<string | null>(null);
    const { addItem } = useCart();
    const [publicUrl, setPublicUrl] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
          setPublicUrl(window.location.href);
        }
    }, []);

    const currencySymbol = useMemo(() => (currency === 'USD' ? '$' : 'FC'), [currency]);

    useEffect(() => {
        const usernameToShowcase = params.user as string || 'milbus';
        if (!usernameToShowcase) {
            setError("L'utilisateur de la vitrine n'est pas spécifié.");
            return;
        }

        try {
            const data: AppData = loadData(usernameToShowcase);
            if (data && data.showcase) {
                setItems(data.showcase.filter(item => item.published));
                setBusinessName(data.user?.businessName || "MiLBus");
                setCurrency(data.user?.currency || 'FC');
            } else {
                 setItems([]);
                 setBusinessName("MiLBus");
                 setCurrency('FC');
            }
        } catch (e) {
            console.error(e);
            setError("Données de la vitrine corrompues ou introuvables. L'administrateur doit la configurer.");
        }
    }, [params.user]);

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    
    if (items.length === 0 && !error) {
        return (
             <div className="container mx-auto p-4 md:p-8 text-center">
                 <header className="relative text-center mb-10">
                    <div className="inline-block bg-primary text-primary-foreground rounded-full p-3 mb-4">
                        <MilbusLogo className="h-12 w-12" />
                    </div>
                    <h1 className="text-4xl font-headline font-bold text-primary mb-2">
                       Bientôt de retour !
                    </h1>
                 </header>
                <div className="text-center py-10 text-muted-foreground">Aucun produit n'est publié dans la vitrine pour le moment. Revenez bientôt !</div>
             </div>
        )
    }

    return (
         <div className="container mx-auto p-4 md:p-8">
            <header className="relative text-center mb-10">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-0 left-0"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Retour</span>
                </Button>
                <div className="absolute top-0 right-0">
                    <Cart />
                </div>
                <div className="inline-block bg-primary text-primary-foreground rounded-full p-3 mb-4">
                    <MilbusLogo className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-headline font-bold text-primary mb-2">
                    Découvrez nos Nouveautés
                </h1>
                <p className="text-lg text-muted-foreground">
                    Une sélection de nos meilleurs articles, choisis pour vous.
                </p>
            </header>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map(item => (
                    <Card key={item.id} className="overflow-hidden group flex flex-col">
                        <div className="relative w-full aspect-[4/5]">
                           <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <CardHeader className="p-3">
                            <CardTitle className="text-base truncate">{item.name}</CardTitle>
                            <CardDescription className="font-semibold text-primary">{(item.price ?? 0).toFixed(2)} {currencySymbol}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 mt-auto">
                            <p className="text-muted-foreground text-sm mb-3 h-10 overflow-hidden">{item.description}</p>
                            <Button className="w-full" onClick={() => addItem({ ...item, price: item.price ?? 0 })}>
                                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator className="my-12" />

            <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Partagez la bonne nouvelle !</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Si vous aimez nos produits, partagez notre boutique avec vos amis et votre famille.</p>
                <div className="flex justify-center">
                    <SocialShare url={publicUrl} title={`Découvrez la boutique ${businessName} !`} />
                </div>
            </div>
            
            <footer className="text-center mt-12 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {businessName}. Tous droits réservés.</p>
                <p>Conçu par Micheline Ntale</p>
            </footer>
        </div>
    );
}


export default function ShowcasePage() {
    return (
        <Suspense fallback={<div>Chargement de la vitrine...</div>}>
            <ShowcaseContent />
        </Suspense>
    );
}

    