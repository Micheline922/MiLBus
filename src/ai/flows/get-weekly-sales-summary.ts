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
      'A summary of the sales evolution for the week, highlighting key trends, top-selling products, and a general overview.'
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
  prompt: `You are an expert sales analyst.
  Analyze the following sales data for the week and generate a concise summary of the sales evolution.
  Identify the best-selling products, any noticeable trends (e.g., certain days with high sales), and provide a brief, easy-to-understand overview.

  Weekly Sales Data:
  {{{salesData}}}

  Your summary should be encouraging and insightful for a small business owner.
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
