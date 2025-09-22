
'use client';

import { getMonthlySalesAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { BarChart } from 'lucide-react';
import { useState, useTransition } from 'react';

type Insights = {
  insights: string;
};

export default function MonthlyEvolutionAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState('');

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      const result = await getMonthlySalesAnalysis(salesData);
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
        <CardTitle className="flex items-center gap-2">
            <BarChart className="text-primary" />
            Évolution des Ventes par Mois
        </CardTitle>
        <CardDescription>
            Collez vos données de ventes mensuelles ci-dessous, puis cliquez sur "Analyser" pour que l'IA identifie les tendances clés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
            placeholder="Exemple : 
Produit: Chouchou en satin, Vendu: 50, Date: 2024-07-01
Produit: Gloss 'Crystal', Vendu: 30, Date: 2024-07-01
..."
            value={salesData}
            onChange={(e) => setSalesData(e.target.value)}
            className="min-h-[150px]"
            disabled={isPending}
        />
        <Button onClick={handleAnalysis} disabled={isPending || !salesData.trim()}>
            {isPending ? 'Analyse en cours...' : 'Analyser les données'}
        </Button>
        
        <Separator />

        {isPending && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
        {error && <p className="text-destructive text-sm pt-4">{error}</p>}
        {insights && !isPending && (
          <div className="space-y-6 text-sm pt-4">
            <div>
              <h3 className="font-semibold text-base mb-2">Analyse des Tendances de Ventes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{insights.insights}</p>
            </div>
          </div>
        )}
        {!insights && !isPending && !error && (
            <div className="text-center text-muted-foreground py-8">
                <p>Vos résultats d'analyse apparaîtront ici.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
