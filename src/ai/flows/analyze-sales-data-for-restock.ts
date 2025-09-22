'use server';

/**
 * @fileOverview Analyzes sales data to provide restocking recommendations.
 *
 * - analyzeSalesDataForRestock - A function that analyzes sales data and recommends products for restocking.
 * - AnalyzeSalesDataForRestockInput - The input type for the analyzeSalesDataForRestock function.
 * - AnalyzeSalesDataForRestockOutput - The return type for the analyzeSalesDataForRestock function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSalesDataForRestockInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'A string containing sales data, including product names, quantities sold, and dates of sale.'
    ),
});
export type AnalyzeSalesDataForRestockInput = z.infer<
  typeof AnalyzeSalesDataForRestockInputSchema
>;

const AnalyzeSalesDataForRestockOutputSchema = z.object({
  restockRecommendations: z
    .string()
    .describe(
      'Une liste de noms de produits à réapprovisionner, ainsi que les quantités recommandées.'
    ),
  salesTrends: z
    .string()
    .describe('Un résumé des tendances de vente identifiées dans les données.'),
});
export type AnalyzeSalesDataForRestockOutput = z.infer<
  typeof AnalyzeSalesDataForRestockOutputSchema
>;

export async function analyzeSalesDataForRestock(
  input: AnalyzeSalesDataForRestockInput
): Promise<AnalyzeSalesDataForRestockOutput> {
  return analyzeSalesDataForRestockFlow(input);
}

const analyzeSalesDataForRestockPrompt = ai.definePrompt({
  name: 'analyzeSalesDataForRestockPrompt',
  input: {schema: AnalyzeSalesDataForRestockInputSchema},
  output: {schema: AnalyzeSalesDataForRestockOutputSchema},
  prompt: `Vous êtes un assistant IA qui aide un propriétaire de petite entreprise à gérer ses stocks.
  Analysez les données de ventes suivantes pour identifier les produits à réapprovisionner et fournir un résumé des tendances des ventes.
  Toutes les réponses doivent être en français.

  Données de ventes :
  {{salesData}}

  Sur la base de ces données, fournissez une liste de produits à réapprovisionner et les quantités recommandées.
  Fournissez également un résumé des tendances de ventes que vous identifiez.
  `,
});

const analyzeSalesDataForRestockFlow = ai.defineFlow(
  {
    name: 'analyzeSalesDataForRestockFlow',
    inputSchema: AnalyzeSalesDataForRestockInputSchema,
    outputSchema: AnalyzeSalesDataForRestockOutputSchema,
  },
  async input => {
    const {output} = await analyzeSalesDataForRestockPrompt(input);
    return output!;
  }
);
