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
      'A list of product names to restock, along with the recommended quantities.'
    ),
  salesTrends: z
    .string()
    .describe('A summary of sales trends identified in the data.'),
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
  prompt: `You are an AI assistant helping a small business owner manage their inventory.
  Analyze the following sales data to identify products that need restocking and provide a summary of sales trends.

  Sales Data:
  {{salesData}}

  Based on this data, provide a list of products to restock and the recommended quantities.
  Also, provide a summary of any sales trends you identify.
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
