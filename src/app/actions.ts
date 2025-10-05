
'use server';

import { analyzeSalesDataForRestock, AnalyzeSalesDataForRestockOutput } from '@/ai/flows/analyze-sales-data-for-restock';
import { getSalesTrendInsights, GetSalesTrendInsightsOutput } from '@/ai/flows/get-sales-trend-insights';
import { getWeeklySalesSummary, GetWeeklySalesSummaryOutput } from '@/ai/flows/get-weekly-sales-summary';
import { menuSuggester, MenuSuggesterOutput } from '@/ai/flows/menu-suggester-flow';

type AiInsightResult = {
    data?: AnalyzeSalesDataForRestockOutput;
    error?: string;
}

export async function getAiSalesInsights(salesData: string): Promise<AiInsightResult> {
  if (!salesData.trim()) {
    return { error: 'Veuillez fournir des données de ventes à analyser.' };
  }
  try {
    const insights = await analyzeSalesDataForRestock({ salesData });
    return { data: insights };
  } catch (e) {
    console.error('AI Insight Error:', e);
    return { error: 'Une erreur est survenue lors de l\'analyse des données.' };
  }
}

type WeeklySummaryResult = {
  data?: GetWeeklySalesSummaryOutput;
  error?: string;
}

export async function getWeeklyAiSummary(salesData: string): Promise<WeeklySummaryResult> {
    if (!salesData.trim()) {
        return { error: 'Veuillez fournir des données de ventes à analyser.' };
    }
  try {
    const summary = await getWeeklySalesSummary({ salesData });
    return { data: summary };
  } catch (e) {
    console.error('Weekly AI Summary Error:', e);
    return { error: 'Une erreur est survenue lors de la génération du résumé hebdomadaire.' };
  }
}

type MenuSuggestionResult = {
    data?: MenuSuggesterOutput;
    error?: string;
}

export async function getMenuSuggestion(prompt: string): Promise<MenuSuggestionResult> {
    try {
        const suggestion = await menuSuggester({ prompt });
        return { data: suggestion };
    } catch (e) {
        console.error('Menu Suggestion Error:', e);
        return { error: 'An error occurred while generating a suggestion.' };
    }
}

type SalesTrendResult = {
    data?: GetSalesTrendInsightsOutput;
    error?: string;
}

export async function getMonthlySalesAnalysis(salesData: string): Promise<SalesTrendResult> {
    if (!salesData.trim()) {
        return { error: 'Veuillez fournir des données de ventes à analyser.' };
    }
    try {
        const result = await getSalesTrendInsights({ salesData });
        return { data: result };
    } catch (e) {
        console.error('Sales Trend Error:', e);
        return { error: 'Une erreur est survenue lors de l\'analyse des tendances de ventes.' };
    }
}
