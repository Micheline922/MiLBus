
'use server';

/**
 * @fileOverview A flow for generating a logo using an AI model.
 *
 * - generateLogo - A function that takes a description and returns a generated image as a data URI.
 * - GenerateLogoInput - The input type for the generateLogo function.
 * - GenerateLogoOutput - The return type for the generateLogo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLogoInputSchema = z.object({
  description: z.string().describe('A description of the company or brand for which to generate a logo.'),
});
export type GenerateLogoInput = z.infer<typeof GenerateLogoInputSchema>;

const GenerateLogoOutputSchema = z.object({
  logoUrl: z.string().describe("The generated logo image as a data URI. Expected format: 'data:image/...;base64,...'"),
});
export type GenerateLogoOutput = z.infer<typeof GenerateLogoOutputSchema>;

export async function generateLogo(input: GenerateLogoInput): Promise<GenerateLogoOutput> {
  return generateLogoFlow(input);
}

const prompt = `
Generate a modern, elegant, and minimalist logo based on the following company description.
The logo should be suitable for a beauty, style, and high-quality products brand.
It should be simple, memorable, and work well in black and white or color.
Output a visually striking logo on a clean, solid background. Do not include any text in the logo itself.

Description:
"{{description}}"
`;

const generateLogoFlow = ai.defineFlow(
  {
    name: 'generateLogoFlow',
    inputSchema: GenerateLogoInputSchema,
    outputSchema: GenerateLogoOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt.replace('{{description}}', input.description),
    });
    
    if (!media.url) {
      throw new Error('Logo generation failed: No image was returned.');
    }

    return {
      logoUrl: media.url,
    };
  }
);
