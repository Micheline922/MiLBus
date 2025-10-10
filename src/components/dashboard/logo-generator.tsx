
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { generateLogoAction } from '@/app/actions';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

type LogoGeneratorProps = {
  description: string;
};

export default function LogoGenerator({ description }: LogoGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateLogo = () => {
    setError(null);
    setLogoUrl(null);
    startTransition(async () => {
      const result = await generateLogoAction(description);
      if (result.error || !result.data) {
        const errorMessage = result.error || "La génération a échoué pour une raison inconnue.";
        setError(errorMessage);
        toast({
            variant: 'destructive',
            title: 'Erreur de Génération',
            description: errorMessage,
        });
      } else {
        setLogoUrl(result.data.logoUrl);
        toast({
            title: 'Logo généré avec succès !',
            description: 'Voici votre nouveau logo créé par l\'IA.',
        });
      }
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h3 className="text-base font-semibold">Générateur de Logo par IA</h3>
            <p className="text-sm text-muted-foreground">Créez un logo unique à partir de la présentation de votre entreprise.</p>
        </div>
        <Button onClick={handleGenerateLogo} disabled={isPending || !description}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isPending ? 'Génération en cours...' : 'Générer un logo'}
        </Button>
      </div>

      {(isPending || logoUrl || error) && (
        <div className="pt-4 border-t">
          {isPending && (
             <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Skeleton className="h-40 w-40 rounded-lg" />
                <p className="text-sm animate-pulse">L'IA est en train de créer votre logo...</p>
             </div>
          )}
          {error && !isPending &&(
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>La génération a échoué</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {logoUrl && !isPending && (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="font-medium">Voici votre nouveau logo !</p>
              <div className="relative h-40 w-40 rounded-lg overflow-hidden border">
                <Image src={logoUrl} alt="Logo généré par IA" layout="fill" objectFit="contain" />
              </div>
               <p className="text-xs text-muted-foreground max-w-sm">
                Vous pouvez faire un clic droit sur l'image pour la sauvegarder. Actualisez la page pour en générer une nouvelle.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
