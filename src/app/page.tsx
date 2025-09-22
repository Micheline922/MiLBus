import { Button } from "@/components/ui/button";
import Link from "next/link";

function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V7" />
            <path d="M2 7v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7" />
        </svg>
    );
}

export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <StoreIcon className="h-10 w-10" />
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
