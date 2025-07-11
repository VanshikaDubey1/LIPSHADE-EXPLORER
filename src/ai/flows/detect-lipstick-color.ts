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
  prompt: `You are an AI beauty expert that specializes in identifying lipstick shades from images of people.

Your task is to analyze the provided image and identify the lipstick shade worn on the lips.
Isolate the lip area and determine the most accurate, dominant hex color code for the lipstick.
Consider lighting, but try to find the true color of the product.

If you can clearly identify a lipstick color, return the hex code in the 'hexColor' field.
If you cannot detect any clear lipstick color, or if the image is blurry, too dark, doesn't show lips clearly, or has no lipstick, you MUST respond by providing a polite error message in the 'error' field. For example: "We couldn't detect a clear lipstick shade in this photo. Please try a brighter, clearer image."

Do not provide both a hex code and an error. It must be one or the other.

Image: {{media url=photoDataUri}}`,
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
