'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting the dominant color of a lipstick in an image.
 *
 * - detectLipstickColor - A function that takes an image as input and returns the dominant color of the lipstick.
 * - DetectLipstickColorInput - The input type for the detectLipstickColor function, which is a data URI of the lipstick image.
 * - DetectLipstickColorOutput - The return type for the detectLipstickColor function, which contains the hex code of the dominant color.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLipstickColorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a lipstick shade, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectLipstickColorInput = z.infer<typeof DetectLipstickColorInputSchema>;

const DetectLipstickColorOutputSchema = z.object({
  hexColor: z
    .string()
    .describe('The dominant color of the lipstick in hex code format (e.g., #RRGGBB).'),
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
  prompt: `You are an AI image analyzer specializing in color detection for lipstick shades.

  Analyze the provided image of a lipstick and identify the dominant color. Return the hex code of this color.
  Do not provide any additional context or explanation.
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
