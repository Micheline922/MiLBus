
'use client';
    
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

function WelcomePageContent() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isLoading, isAuthenticated, router]);
    
    if (isLoading || isAuthenticated) {
        return <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4">
                <MilbusLogo className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">
                Bienvenue chez MiLBus
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md">
                Une maison avec des produits de qualité, où chaque article est une promesse de style et d'élégance.
            </p>
            <Button asChild size="lg">
                <Link href="/login">Pour votre curiosité, rejoignez-nous</Link>
            </Button>
        </div>
    );
}

export default function WelcomePage() {
    // This is now wrapped in a layout that provides the AuthContext
    return <WelcomePageContent />;
}
