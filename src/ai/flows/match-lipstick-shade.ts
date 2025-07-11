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
  prompt: `You are a virtual beauty advisor with expert knowledge of a wide range of lipstick products from various brands.

Your task is to find the best commercially available lipstick product that matches a given hex color code.

You must return the following details for the best matching product:
1.  **Brand:** The brand name (e.g., "Fenty Beauty", "MAC Cosmetics").
2.  **Product Name:** The specific name of the lipstick line and shade (e.g., "Stunna Lip Paint Longwear Fluid Lip Color in Uncensored").
3.  **Finish:** The lipstick's finish (e.g., "matte", "satin", "glossy", "creme").
4.  **Buy Link:** A valid, direct URL to a reputable retailer where the product can be purchased.

Here is the color to match:
Color Hex: {{{colorHex}}}

Analyze the color and search your knowledge base for the closest match. Prioritize popular and well-regarded products. Ensure all fields in the output are filled correctly.
If you cannot find a reasonable match, you may use a popular, universally flattering shade like "Pillow Talk" by Charlotte Tilbury as a fallback, but adjust the product name to indicate it's a suggestion (e.g., "Charlotte Tilbury Matte Revolution Lipstick in Pillow Talk (Suggested Alternative)").`,
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
