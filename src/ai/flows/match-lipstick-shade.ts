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
import { findSimilarLipsticks, LipstickProduct } from '@/services/lipstick-service';

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
  input: {
    schema: z.object({
      colorHex: z.string(),
      similarProducts: z.array(z.object({
        brand: z.string(),
        productName: z.string(),
        hex: z.string(),
        finish: z.string(),
        buyLink: z.string().url(),
      })),
    }),
  },
  output: {schema: MatchLipstickShadeOutputSchema},
  prompt: `You are a virtual beauty advisor with expert knowledge of lipstick products.

Your task is to find the best commercially available lipstick product that matches a given hex color code, based on a provided list of similar products.

You must return the following details for the BEST matching product from the list:
1.  **Brand:** The brand name.
2.  **Product Name:** The specific name of the lipstick line and shade.
3.  **Finish:** The lipstick's finish.
4.  **Buy Link:** A valid, direct URL to a reputable retailer.

Here is the color to match:
Target Color Hex: {{{colorHex}}}

Here is a list of potential products. Choose the one that is the closest color match to the target hex code.

Available Products:
{{#each similarProducts}}
- Brand: {{brand}}
- Product Name: {{productName}}
- Hex: {{hex}}
- Finish: {{finish}}
- Buy Link: {{buyLink}}
---
{{/each}}

Analyze the target color and the hex codes of the available products, then select the best match and provide its details in the required output format. Do not invent products or details.
`,
});

const matchLipstickShadeFlow = ai.defineFlow(
  {
    name: 'matchLipstickShadeFlow',
    inputSchema: MatchLipstickShadeInputSchema,
    outputSchema: MatchLipstickShadeOutputSchema,
  },
  async (input) => {
    // Find lipstick products with colors similar to the input hex code
    const similarProducts = await findSimilarLipsticks(input.colorHex);

    if (similarProducts.length === 0) {
      // Fallback if no products are found, though our service should always return something
      return {
        brand: 'Charlotte Tilbury',
        productName: 'Matte Revolution Lipstick in Pillow Talk (Suggested)',
        finish: 'Matte',
        buyLink: 'https://www.charlottetilbury.com/us/product/matte-revolution-lipstick-pillow-talk',
      };
    }

    const { output } = await prompt({
      colorHex: input.colorHex,
      similarProducts: similarProducts,
    });
    
    return output!;
  }
);
