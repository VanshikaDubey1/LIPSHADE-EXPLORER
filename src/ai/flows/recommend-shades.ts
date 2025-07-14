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
import { getFullLipstickDatabase, LipstickProduct } from '@/services/lipstick-service';

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
  input: {
    schema: z.object({
      photoDataUri: z.string(),
      allProducts: z.array(z.object({
        brand: z.string(),
        productName: z.string(),
        hex: z.string(),
        finish: z.string(),
        buyLink: z.string().url(),
      })),
    })
  },
  output: {schema: RecommendShadesOutputSchema},
  prompt: `You are a world-class AI makeup artist. Your task is to analyze the provided image of a face and select the three most flattering lipstick shades from a provided list of products.

**Reasoning Process:**
1.  **Analyze Skin Tone:** Carefully examine the user's face in the image. Determine their overall skin tone (e.g., fair, light, medium, tan, deep) and undertone (cool, warm, neutral).
2.  **Select Three Perfect Shades:** Based on your analysis, review the 'Available Products' list. You MUST choose exactly THREE products that would be most flattering for the user's complexion.
    *   One **Red** shade.
    *   One **Pink** shade.
    *   One **Nude** shade.
3.  **Provide Product Details:** For each chosen product, you must extract its details directly from the list. Do not invent or alter information.

**Response Rules:**
*   **Success:** If you can analyze the face, you MUST return an array of exactly three recommendations in the \`recommendations\` field, one for each category (Red, Pink, Nude). Provide the category, hexColor (from the 'hex' field), productName, and brand for each.
*   **Failure:** If the image does not clearly show a face, is blurry, or unsuitable for analysis, you MUST return a polite error message in the \`error\` field. Example: "Could not analyze the face in the photo. Please provide a clear, forward-facing picture."

**Image for analysis:** {{media url=photoDataUri}}

---

**Available Products:**
{{#each allProducts}}
- Brand: {{brand}}
- Product Name: {{productName}}
- Hex: {{hex}}
---
{{/each}}
`,
});


const recommendShadesFlow = ai.defineFlow(
  {
    name: 'recommendShadesFlow',
    inputSchema: RecommendShadesInputSchema,
    outputSchema: RecommendShadesOutputSchema,
  },
  async input => {
    const allProducts = await getFullLipstickDatabase();
    
    // Categorize products to help the AI
    const categorizedProducts = allProducts.map(p => {
        const name = p.productName.toLowerCase();
        let category: 'Red' | 'Pink' | 'Nude' | 'Other' = 'Other';
        if (name.includes('red') || name.includes('berry') || name.includes('wine') || name.includes('cherry')) {
            category = 'Red';
        } else if (name.includes('pink') || name.includes('rose') || name.includes('mauve')) {
            category = 'Pink';
        } else if (name.includes('nude') || name.includes('peach') || name.includes('brown') || name.includes('taupe') || name.includes('pillow talk')) {
            category = 'Nude';
        }
        return {...p, category};
    });

    const {output} = await prompt({ 
      photoDataUri: input.photoDataUri,
      allProducts: categorizedProducts
    });

    if (!output) {
      return { recommendations: [], error: 'Failed to get a response from the AI model.' };
    }

    // Ensure the output recommendations are valid products from our database
    if (output.recommendations) {
      output.recommendations = output.recommendations.map(rec => {
        const foundProduct = allProducts.find(p => p.productName === rec.productName);
        if (foundProduct) {
          return { ...rec, hexColor: foundProduct.hex }; // Use the real hex from our DB
        }
        return rec; // Should ideally not happen if prompt is followed
      });
    }

    return output;
  }
);
