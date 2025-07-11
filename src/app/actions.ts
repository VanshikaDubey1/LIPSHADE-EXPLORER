'use server';

import { detectLipstickColor } from '@/ai/flows/detect-lipstick-color';
import { matchLipstickShade } from '@/ai/flows/match-lipstick-shade';
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';

export async function getShadeMatch(formData: FormData): Promise<{ detectedColor: string; match: MatchLipstickShadeOutput; error?: undefined; } | { error: string; detectedColor?: undefined; match?: undefined; }> {
  try {
    const imageFile = formData.get('image') as File | null;
    
    // A simple check for initial module load
    if (!imageFile || imageFile.size === 0) {
      return { error: 'No image provided.' };
    }
    
    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return { error: 'Invalid file type. Please upload an image.' };
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const photoDataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    const colorDetectionResult = await detectLipstickColor({ photoDataUri });
    
    if (colorDetectionResult.error || !colorDetectionResult.hexColor) {
      return { error: colorDetectionResult.error || 'Could not detect a color in the image. Please try a clearer picture.' };
    }

    const matchResult = await matchLipstickShade({ colorHex: colorDetectionResult.hexColor });
    
    if (!matchResult?.brand) {
       return { error: 'Could not find a matching lipstick. Please try another shade.' };
    }
    
    return {
      detectedColor: colorDetectionResult.hexColor,
      match: matchResult,
    };
  } catch (error) {
    console.error('An error occurred in getShadeMatch:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
