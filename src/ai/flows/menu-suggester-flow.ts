'use server';
/**
 * @fileOverview An AI agent that provides conversational responses.
 *
 * - menuSuggester - A function that handles conversational prompts.
 * - MenuSuggesterInput - The input type for the menuSuggester function.
 * - MenuSuggesterOutput - The return type for the menuSuggester function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuSuggesterInputSchema = z.object({
  prompt: z.string().describe('The user\'s conversational input.'),
});
export type MenuSuggesterInput = z.infer<typeof MenuSuggesterInputSchema>;

const MenuSuggesterOutputSchema = z.object({
  suggestion: z.string().describe('The AI\'s conversational response.'),
});
export type MenuSuggesterOutput = z.infer<typeof MenuSuggesterOutputSchema>;

export async function menuSuggester(input: MenuSuggesterInput): Promise<MenuSuggesterOutput> {
  return menuSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'menuSuggesterPrompt',
  input: {schema: MenuSuggesterInputSchema},
  output: {schema: MenuSuggesterOutputSchema},
  prompt: `Vous êtes un assistant IA utile pour une propriétaire de petite entreprise.
  Répondez à sa demande de manière conversationnelle et utile.
  Toutes les réponses doivent être en français.
  L'entreprise vend des bijoux, des accessoires, des perruques et des pâtisseries.
  
  Invite de l'utilisateur :
  {{{prompt}}}
  `,
});

const menuSuggesterFlow = ai.defineFlow(
  {
    name: 'menuSuggesterFlow',
    inputSchema: MenuSuggesterInputSchema,
    outputSchema: MenuSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
