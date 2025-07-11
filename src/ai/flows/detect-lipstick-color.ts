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
  prompt: `You are an AI beauty expert with an exceptional eye for color, specializing in identifying lipstick shades from images. Your task is to analyze the provided photo and determine the precise hex code of the lipstick being worn.

**CRITICAL INSTRUCTIONS:**
Your primary goal is to determine the lipstick's **true color**, as it would appear in the tube or as a swatch on a pure white background. You must mentally filter out environmental factors.

Follow this exact reasoning process:
1.  **Identify the Lips:** Locate the lips in the image.
2.  **Analyze Context:**
    *   **Lighting:** Assess the lighting. Are there bright highlights, reflections, or dark shadows? These are not part of the lipstick's true color.
    *   **Skin Tone:** Observe the surrounding skin tone. The lipstick color will look different on various skin tones, but you must identify the product's color, not how it appears on this specific person.
3.  **Isolate the True Color:** Based on your analysis, find the most representative, dominant color of the lipstick itself, completely ignoring the effects of light, shadow, and skin tone. This is the most critical step.
4.  **Determine and Output Hex Code:** Convert this isolated, true color into a 6-digit hex code (e.g., #C01A29).

**Response Rules:**
*   **Success:** If you can accurately determine the lipstick's true color, you MUST return ONLY the hex code in the \`hexColor\` field.
*   **Failure:** If the image is blurry, dark, unclear, or does not show lips with lipstick, you MUST return ONLY a polite error message in the \`error\` field. Example: "We couldn't detect a clear lipstick shade. Please try a brighter, clearer photo."

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
