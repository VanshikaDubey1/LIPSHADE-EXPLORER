'use server';

import { detectLipstickColor } from '@/ai/flows/detect-lipstick-color';
import { matchLipstickShade } from '@/ai/flows/match-lipstick-shade';
import { recommendShades } from '@/ai/flows/recommend-shades';
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';
import type { RecommendShadesOutput } from '@/ai/flows/recommend-shades';

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

export async function getRecommendedShades(formData: FormData): Promise<RecommendShadesOutput> {
  try {
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) {
      return { recommendations: [], error: 'No image provided for recommendation.' };
    }

    if (!imageFile.type.startsWith('image/')) {
      return { recommendations: [], error: 'Invalid file type. Please upload an image.' };
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const photoDataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    const recommendationResult = await recommendShades({ photoDataUri });
    
    if (recommendationResult.error || !recommendationResult.recommendations?.length) {
      return { recommendations: [], error: recommendationResult.error || 'Could not generate recommendations from the image.' };
    }

    return recommendationResult;
  } catch (error) {
    console.error('An error occurred in getRecommendedShades:', error);
    return { recommendations: [], error: 'An unexpected server error occurred.' };
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // This is where you would add your actual authentication logic.
    // For demonstration, we'll simulate a network delay and check mock credentials.
    console.log('Attempting to authenticate user...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const email = formData.get('email');
    const password = formData.get('password');

    // MOCK CREDENTIALS
    const MOCK_EMAIL = 'user@example.com';
    const MOCK_PASSWORD = 'password123';

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      console.log('Authentication successful!');
      // In a real app, you would set a session cookie here and redirect.
      // For now, we'll just log success and return nothing on success.
      return; 
    }

    console.log('Invalid credentials.');
    return 'Invalid email or password. Please try again.';
  } catch (error) {
    console.error('Authentication error:', error);
    return 'Something went wrong during authentication.';
  }
}
