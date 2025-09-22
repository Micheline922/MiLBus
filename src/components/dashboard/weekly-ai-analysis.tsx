'use client';

import { getWeeklyAiSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarRange } from 'lucide-react';
import { useState, useTransition } from 'react';

type Summary = {
  weeklySummary: string;
};

export default function WeeklyAiAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      const result = await getWeeklyAiSummary();
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="text-primary" />
              Analyse Hebdomadaire IA
            </CardTitle>
            <CardDescription>
              Obtenez un résumé de l'évolution de vos ventes pour la semaine en cours.
            </CardDescription>
          </div>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? 'Analyse en cours...' : 'Générer le résumé'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {summary && !isPending && (
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-base mb-2">Résumé de la Semaine</h3>
              <p className="text-muted-foreground whitespace-pre-line">{summary.weeklySummary}</p>
            </div>
          </div>
        )}
        {!summary && !isPending && !error && (
            <div className="text-center text-muted-foreground py-8">
                <p>Cliquez sur le bouton pour générer une analyse de vos ventes hebdomadaires.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
