'use server';

/**
 * @fileOverview A flow to match a lipstick shade from an image to a lipstick product.
 *
 * - matchLipstickShade - A function that handles the lipstick shade matching process.
 * - MatchLipstickShadeInput - The input type for the matchLipstickShade function.
 * - MatchLipstickShadeOutput - The return type for the matchLipstickShade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchLipstickShadeInputSchema = z.object({
  colorHex: z
    .string()
    .describe("The hex color code of the detected lipstick shade."),
});
export type MatchLipstickShadeInput = z.infer<typeof MatchLipstickShadeInputSchema>;

const MatchLipstickShadeOutputSchema = z.object({
  brand: z.string().describe('The brand of the matching lipstick.'),
  productName: z.string().describe('The name of the matching lipstick.'),
  finish: z.string().describe('The finish of the matching lipstick (e.g., matte, satin, glossy).'),
  buyLink: z.string().url().describe('The link to purchase the matching lipstick.'),
});
export type MatchLipstickShadeOutput = z.infer<typeof MatchLipstickShadeOutputSchema>;

export async function matchLipstickShade(input: MatchLipstickShadeInput): Promise<MatchLipstickShadeOutput> {
  return matchLipstickShadeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchLipstickShadePrompt',
  input: {schema: MatchLipstickShadeInputSchema},
  output: {schema: MatchLipstickShadeOutputSchema},
  prompt: `You are a beauty expert that knows all the lipstick products in the market.

You are given a color in hex format. Find the best matching lipstick product and return its brand, product name, finish, and a link to buy it.

Color: {{{colorHex}}}`,
});

const matchLipstickShadeFlow = ai.defineFlow(
  {
    name: 'matchLipstickShadeFlow',
    inputSchema: MatchLipstickShadeInputSchema,
    outputSchema: MatchLipstickShadeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
