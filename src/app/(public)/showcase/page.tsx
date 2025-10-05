
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { loadData } from '@/lib/storage';
import { ShowcaseItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

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
    const searchParams = useSearchParams();
    const router = useRouter();
    const username = searchParams.get('user');
    const [items, setItems] = useState<ShowcaseItem[]>([]);
    const [businessName, setBusinessName] = useState("MiLBus");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            try {
                const data = loadData(username);
                if (data && data.showcase) {
                    setItems(data.showcase.filter(item => item.published));
                    const userData = localStorage.getItem(`milbus-user-credentials`);
                     if (userData) {
                        const parsedUser = JSON.parse(userData);
                        if(parsedUser.businessName) setBusinessName(parsedUser.businessName);
                    }
                } else {
                    setError("Impossible de charger la vitrine pour cet utilisateur.");
                }
            } catch (e) {
                setError("Utilisateur non trouvé ou données corrompues.");
            }
        } else {
            setError("Aucun utilisateur spécifié pour afficher la vitrine.");
        }
    }, [username]);

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    
    if (items.length === 0 && !error) {
        return <div className="text-center py-10 text-muted-foreground">Aucun produit publié dans la vitrine pour le moment.</div>;
    }

    return (
         <div className="container mx-auto p-4 md:p-8">
            <header className="relative text-center mb-10">
                 <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-0 left-0"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Retour</span>
                </Button>
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
            
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map(item => (
                    <Card key={item.id} className="overflow-hidden group">
                        <div className="relative w-full aspect-[4/3]">
                           <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="text-base font-semibold text-primary">{item.price.toFixed(2)} FC</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-muted-foreground text-sm mb-4 h-16 overflow-hidden">{item.description}</p>
                            <Button className="w-full">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                            </Button>
                        </CardContent>
                    </Card>
                ))}
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
