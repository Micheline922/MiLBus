
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadData } from '@/lib/storage';
import { ShowcaseItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

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
    const username = searchParams.get('user');
    const [items, setItems] = useState<ShowcaseItem[]>([]);
    const [businessName, setBusinessName] = useState("MiLBus");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            const data = loadData(username);
            if (data && data.showcase) {
                setItems(data.showcase.filter(item => item.published));
                setBusinessName(data.stats.totalRevenue.value); // A bit of a hack, let's get it from user settings later
            } else {
                setError("Impossible de charger la vitrine pour cet utilisateur.");
            }
        } else {
            setError("Aucun utilisateur spécifié pour afficher la vitrine.");
        }
    }, [username]);

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    
    if (items.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">Aucun produit publié dans la vitrine pour le moment.</div>;
    }

    return (
         <div className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-10">
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
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map(item => (
                    <Card key={item.id} className="overflow-hidden group">
                        <div className="relative w-full aspect-square">
                           <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">{item.name}</CardTitle>
                            <CardDescription className="text-base font-semibold text-primary">{item.price.toFixed(2)} FC</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm mb-4 h-20 overflow-hidden">{item.description}</p>
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
    return <ShowcaseContent />;
}
