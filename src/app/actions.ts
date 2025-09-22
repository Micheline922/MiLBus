'use server';

import { analyzeSalesDataForRestock, AnalyzeSalesDataForRestockOutput } from '@/ai/flows/analyze-sales-data-for-restock';

// This is a sample of what your sales data might look like.
// In a real application, you would fetch this from your database.
const DUMMY_SALES_DATA = `
Product: Chouchou en satin, Sold: 50, Date: 2024-07-01
Product: Gloss "Crystal", Sold: 30, Date: 2024-07-01
Product: Perruque "Lisse 18 pouces", Sold: 5, Date: 2024-07-02
Product: Pendentif lune, Sold: 25, Date: 2024-07-03
Product: Chouchou en satin, Sold: 20, Date: 2024-07-04
Product: Perruque "Bouclée 24 pouces", Sold: 2, Date: 2024-07-05
Product: Gloss "Crystal", Sold: 45, Date: 2024-07-06
Product: Parfum "Essence", Sold: 10, Date: 2024-07-07
Product: Chaînette en or, Sold: 15, Date: 2024-07-08
Product: Perruque "Lisse 18 pouces", Sold: 3, Date: 2024-07-09
Product: Chouchou en satin, Sold: 30, Date: 2024-07-10
`;

type AiInsightResult = {
    data?: AnalyzeSalesDataForRestockOutput;
    error?: string;
}

export async function getAiSalesInsights(): Promise<AiInsightResult> {
  try {
    const insights = await analyzeSalesDataForRestock({ salesData: DUMMY_SALES_DATA });
    return { data: insights };
  } catch (e) {
    console.error('AI Insight Error:', e);
    return { error: 'Une erreur est survenue lors de l\'analyse des données.' };
  }
}
