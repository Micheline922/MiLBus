'use client';

import { getWeeklyAiSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CalendarRange } from 'lucide-react';
import { useState, useTransition } from 'react';

type Summary = {
  weeklySummary: string;
};

export default function WeeklyAiAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState('');

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      const result = await getWeeklyAiSummary(salesData);
      if (result.error) {
        setError(result.error);
        setSummary(null);
      } else if (result.data) {
        setSummary(result.data);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="text-primary" />
          Analyse Hebdomadaire IA
        </CardTitle>
        <CardDescription>
          Obtenez un résumé de l'évolution de vos ventes pour la semaine en cours en collant vos données ci-dessous.
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
            {isPending ? 'Analyse en cours...' : 'Générer le résumé'}
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
        {summary && !isPending && (
          <div className="space-y-6 text-sm pt-4">
            <div>
              <h3 className="font-semibold text-base mb-2">Résumé de la Semaine</h3>
              <p className="text-muted-foreground whitespace-pre-line">{summary.weeklySummary}</p>
            </div>
          </div>
        )}
        {!summary && !isPending && !error && (
            <div className="text-center text-muted-foreground py-8">
                <p>Vos résultats d'analyse apparaîtront ici.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
