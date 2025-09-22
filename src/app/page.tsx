import { Button } from "@/components/ui/button";
import Link from "next/link";

function MilbusLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
        >
            <path d="M20 80 Q50 20 80 80" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 80 Q50 50 65 80" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" />
        </svg>
    );
}

export default function WelcomePage() {
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
