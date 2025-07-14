import { config } from 'dotenv';
config();

import '@/ai/flows/match-lipstick-shade.ts';
import '@/ai/flows/detect-lipstick-color.ts';
import '@/ai/flows/recommend-shades.ts';
import '@/services/lipstick-service.ts';
