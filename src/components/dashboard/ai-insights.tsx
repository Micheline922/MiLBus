'use client';

import { getAiSalesInsights } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';
import { useState, useTransition } from 'react';

type Insights = {
  restockRecommendations: string;
  salesTrends: string;
};

export default function AiInsights() {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      const result = await getAiSalesInsights();
      if (result.error) {
        setError(result.error);
        setInsights(null);
      } else if (result.data) {
        setInsights(result.data);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="text-primary" />
              Recommandations IA
            </CardTitle>
            <CardDescription>
              Laissez Gemini analyser vos ventes pour des conseils personnalisés.
            </CardDescription>
          </div>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? 'Analyse en cours...' : 'Analyser les ventes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Separator className="my-4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {insights && !isPending && (
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-base mb-2">Tendances de Ventes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{insights.salesTrends}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-base mb-2">Recommandations de Réapprovisionnement</h3>
              <p className="text-muted-foreground whitespace-pre-line">{insights.restockRecommendations}</p>
            </div>
          </div>
        )}
        {!insights && !isPending && !error && (
            <div className="text-center text-muted-foreground py-8">
                <p>Cliquez sur le bouton pour obtenir des aperçus de vos données de vente.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
