'use server';
/**
 * @fileOverview An AI agent that provides a weekly summary of sales.
 *
 * - getWeeklySalesSummary - A function that generates a weekly sales summary.
 * - GetWeeklySalesSummaryInput - The input type for the getWeeklySalesSummary function.
 * - GetWeeklySalesSummaryOutput - The return type for the getWeeklySalesSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeeklySalesSummaryInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      "A string containing sales data, including product names, quantities sold, and dates of sale for the current week."
    ),
});
export type GetWeeklySalesSummaryInput = z.infer<typeof GetWeeklySalesSummaryInputSchema>;

const GetWeeklySalesSummaryOutputSchema = z.object({
  weeklySummary: z
    .string()
    .describe(
      'Un résumé de l\'évolution des ventes pour la semaine, mettant en évidence les principales tendances, les produits les plus vendus et une vue d\'ensemble générale.'
    ),
});
export type GetWeeklySalesSummaryOutput = z.infer<typeof GetWeeklySalesSummaryOutputSchema>;

export async function getWeeklySalesSummary(input: GetWeeklySalesSummaryInput): Promise<GetWeeklySalesSummaryOutput> {
  return getWeeklySalesSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeeklySalesSummaryPrompt',
  input: {schema: GetWeeklySalesSummaryInputSchema},
  output: {schema: GetWeeklySalesSummaryOutputSchema},
  prompt: `Vous êtes un expert analyste des ventes.
  Analysez les données de ventes suivantes pour la semaine et générez un résumé concis de l'évolution des ventes.
  Identifiez les produits les plus vendus, les tendances notables (par exemple, certains jours avec des ventes élevées), et fournissez un aperçu bref et facile à comprendre.
  Toutes les réponses doivent être en français.

  Données de ventes hebdomadaires :
  {{{salesData}}}

  Votre résumé doit être encourageant et perspicace pour un propriétaire de petite entreprise.
  `,
});

const getWeeklySalesSummaryFlow = ai.defineFlow(
  {
    name: 'getWeeklySalesSummaryFlow',
    inputSchema: GetWeeklySalesSummaryInputSchema,
    outputSchema: GetWeeklySalesSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
