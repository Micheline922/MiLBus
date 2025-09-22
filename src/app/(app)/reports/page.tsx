
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AiInsights from "@/components/dashboard/ai-insights";
import WeeklyAiAnalysis from "@/components/dashboard/weekly-ai-analysis";
import MonthlyEvolutionAnalysis from "@/components/dashboard/monthly-evolution-analysis";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Rapports et Analyses</h1>
          <p className="text-muted-foreground">
            Aperçus détaillés sur la performance de votre entreprise.
          </p>
        </div>
      </div>

       <Tabs defaultValue="monthly_evolution">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly_evolution">Évolution Mensuelle</TabsTrigger>
          <TabsTrigger value="inventory">Recommandations de Stock</TabsTrigger>
          <TabsTrigger value="weekly">Analyse Hebdomadaire</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly_evolution">
          <MonthlyEvolutionAnalysis />
        </TabsContent>
        <TabsContent value="inventory">
          <AiInsights />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyAiAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
