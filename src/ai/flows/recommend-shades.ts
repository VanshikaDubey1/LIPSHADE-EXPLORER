'use server';

/**
 * @fileOverview A Genkit flow for recommending lipstick shades based on skin tone from an image.
 *
 * - recommendShades - A function that takes a facial image and recommends lipstick shades.
 * - RecommendShadesInput - The input type for the recommendShades function.
 * - RecommendShadesOutput - The return type for the recommendShades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findSimilarLipsticks } from '@/services/lipstick-service';

const RecommendShadesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type RecommendShadesInput = z.infer<typeof RecommendShadesInputSchema>;

const RecommendedShadeSchema = z.object({
  category: z.enum(['Red', 'Pink', 'Nude']).describe('The category of the recommended lipstick.'),
  hexColor: z.string().describe('The hex code of the recommended lipstick shade.'),
  productName: z.string().describe('The full name of the recommended product.'),
  brand: z.string().describe('The brand of the recommended product.'),
});

const RecommendShadesOutputSchema = z.object({
  recommendations: z.array(RecommendedShadeSchema).describe('An array of three recommended lipstick shades: one red, one pink, and one nude.'),
  error: z.string().optional().describe('An error message if recommendations cannot be generated.'),
});
export type RecommendShadesOutput = z.infer<typeof RecommendShadesOutputSchema>;


export async function recommendShades(input: RecommendShadesInput): Promise<RecommendShadesOutput> {
  return recommendShadesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendShadesPrompt',
  input: {schema: RecommendShadesInputSchema},
  output: {schema: RecommendShadesOutputSchema},
  prompt: `You are a world-class AI makeup artist. Your task is to analyze the provided image of a face and recommend the three most flattering lipstick shades.

**Reasoning Process:**
1.  **Analyze Skin Tone:** Carefully examine the user's face, paying close attention to the forehead and cheeks. Determine their overall skin tone (e.g., fair, light, medium, tan, deep) and undertone (cool, warm, neutral).
2.  **Select Three Perfect Shades:** Based on your analysis, choose exactly THREE lipstick shades that would be most flattering for the user's complexion. You MUST select one shade from each of the following categories:
    *   One **Red** shade.
    *   One **Pink** shade.
    *   One **Nude** shade.
3.  **Provide Hex Codes:** For each chosen shade, provide its corresponding hex color code. Be specific and choose colors that align with your analysis (e.g., a blue-based red for cool undertones, a peachy nude for warm undertones).
4.  **Suggest Product Names:** For each hex code, create a realistic and appealing product name and assign it to a popular makeup brand. Examples: 'MAC - Ruby Woo', 'Charlotte Tilbury - Pillow Talk', 'Fenty Beauty - Rose Nude'.

**Response Rules:**
*   **Success:** If you can analyze the face, you MUST return an array of exactly three recommendations in the \`recommendations\` field, one for each category (Red, Pink, Nude). Provide the category, hexColor, productName, and brand for each.
*   **Failure:** If the image does not clearly show a face, is blurry, or unsuitable for analysis, you MUST return a polite error message in the \`error\` field. Example: "Could not analyze the face in the photo. Please provide a clear, forward-facing picture."

Image for analysis: {{media url=photoDataUri}}`,
});


const recommendShadesFlow = ai.defineFlow(
  {
    name: 'recommendShadesFlow',
    inputSchema: RecommendShadesInputSchema,
    outputSchema: RecommendShadesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
