'use server';
/**
 * @fileOverview An AI agent that provides insights into sales trends.
 *
 * - getSalesTrendInsights - A function that retrieves sales trend insights.
 * - GetSalesTrendInsightsInput - The input type for the getSalesTrendInsights function.
 * - GetSalesTrendInsightsOutput - The return type for the getSalesTrendInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSalesTrendInsightsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'A string containing sales data, including product categories, dates, and sales amounts.'
    ),
});
export type GetSalesTrendInsightsInput = z.infer<typeof GetSalesTrendInsightsInputSchema>;

const GetSalesTrendInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'A summary of sales trends, including best-selling product categories and seasonal fluctuations.'
    ),
});
export type GetSalesTrendInsightsOutput = z.infer<typeof GetSalesTrendInsightsOutputSchema>;

export async function getSalesTrendInsights(input: GetSalesTrendInsightsInput): Promise<GetSalesTrendInsightsOutput> {
  return getSalesTrendInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSalesTrendInsightsPrompt',
  input: {schema: GetSalesTrendInsightsInputSchema},
  output: {schema: GetSalesTrendInsightsOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing sales data to identify trends.

  Analyze the following sales data and provide insights into sales trends, such as identifying best-selling product categories and seasonal fluctuations.

  Sales Data: {{{salesData}}}

  Based on the sales data, provide a concise summary of the key sales trends.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const getSalesTrendInsightsFlow = ai.defineFlow(
  {
    name: 'getSalesTrendInsightsFlow',
    inputSchema: GetSalesTrendInsightsInputSchema,
    outputSchema: GetSalesTrendInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
