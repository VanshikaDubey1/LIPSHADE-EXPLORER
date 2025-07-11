'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting the lipstick shade from an image of lips.
 *
 * - detectLipstickColor - A function that takes an image as input and returns the dominant color of the lipstick.
 * - DetectLipstickColorInput - The input type for the detectLipstickColor function, which is a data URI of the lipstick image.
 * - DetectLipstickColorOutput - The return type for the detectLipstickColor function, which contains the hex code of the dominant color or an error.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLipstickColorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's lips, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type DetectLipstickColorInput = z.infer<typeof DetectLipstickColorInputSchema>;

const DetectLipstickColorOutputSchema = z.object({
  hexColor: z
    .string()
    .optional()
    .describe('The dominant color of the lipstick in hex code format (e.g., #RRGGBB). This is present only on success.'),
  error: z
    .string()
    .optional()
    .describe('A polite error message if the lipstick color cannot be determined.'),
});
export type DetectLipstickColorOutput = z.infer<typeof DetectLipstickColorOutputSchema>;

export async function detectLipstickColor(
  input: DetectLipstickColorInput
): Promise<DetectLipstickColorOutput> {
  return detectLipstickColorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectLipstickColorPrompt',
  input: {schema: DetectLipstickColorInputSchema},
  output: {schema: DetectLipstickColorOutputSchema},
  prompt: `You are an AI beauty expert that specializes in identifying lipstick shades from images.

Your task is to analyze the provided image and identify the lipstick shade worn on the lips. Follow these steps precisely:
1.  **Examine the Image:** Look for a clear depiction of human lips.
2.  **Isolate Lip Area:** Mentally crop or focus only on the lips, ignoring skin tone, teeth, and background.
3.  **Determine Color:** Analyze the color applied to the lips. Account for shadows and highlights to find the true, dominant color of the lipstick product. The goal is to identify the shade as it would appear in the tube.
4.  **Extract Hex Code:** Convert this dominant color into a standard 6-digit hex code (e.g., #C01A29).

**Response Rules:**
*   **Success:** If you can clearly identify a lipstick color, you MUST return ONLY the hex code in the \`hexColor\` field.
*   **Failure:** If the image does not clearly show lips, is blurry, too dark, overexposed, or if no lipstick is worn, you MUST return ONLY a polite error message in the \`error\` field. Example: "We couldn't detect a clear lipstick shade. Please try a brighter, clearer photo."

**IMPORTANT:** You must provide either a \`hexColor\` OR an \`error\`. NEVER provide both.

Image for analysis: {{media url=photoDataUri}}`,
});

const detectLipstickColorFlow = ai.defineFlow(
  {
    name: 'detectLipstickColorFlow',
    inputSchema: DetectLipstickColorInputSchema,
    outputSchema: DetectLipstickColorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
