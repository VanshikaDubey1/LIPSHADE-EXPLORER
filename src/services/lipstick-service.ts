'use server';

/**
 * @fileOverview A mock service to simulate a lipstick product database.
 */

export type LipstickProduct = {
  id: number;
  brand: string;
  productName: string;
  hex: string;
  finish: 'Matte' | 'Satin' | 'Glossy' | 'Creme' | 'Liquid';
  buyLink: string;
};

// Mock database of lipstick products
const lipstickDatabase: LipstickProduct[] = [
  { id: 1, brand: 'MAC Cosmetics', productName: 'Retro Matte Lipstick in Ruby Woo', hex: '#C01A29', finish: 'Matte', buyLink: 'https://www.maccosmetics.com/product/13854/310/products/makeup/lips/lipstick/retro-matte-lipstick?shade=Ruby_Woo' },
  { id: 2, brand: 'Fenty Beauty', productName: 'Stunna Lip Paint in Uncensored', hex: '#A80C14', finish: 'Liquid', buyLink: 'https://fentybeauty.com/products/stunna-lip-paint-longwear-fluid-lip-color-uncensored' },
  { id: 3, brand: 'NARS', productName: 'Audacious Lipstick in Rita', hex: '#D62139', finish: 'Satin', buyLink: 'https://www.narscosmetics.com/USA/rita-audacious-lipstick/0607845094583.html' },
  { id: 4, brand: 'Charlotte Tilbury', productName: 'Matte Revolution Lipstick in Pillow Talk', hex: '#AB786E', finish: 'Matte', buyLink: 'https://www.charlottetilbury.com/us/product/matte-revolution-lipstick-pillow-talk' },
  { id: 5, brand: 'Dior', productName: 'Rouge Dior Lipstick in 999', hex: '#D01F28', finish: 'Satin', buyLink: 'https://www.dior.com/en_us/products/beauty-Y0027009-rouge-dior-couture-color-lipstick-floral-lip-care-long-wear-refillable' },
  { id: 6, brand: 'Yves Saint Laurent', productName: 'Rouge Pur Couture in Le Rouge (01)', hex: '#D82C35', finish: 'Satin', buyLink: 'https://www.yslbeautyus.com/makeup/lips/lipstick/rouge-pur-couture-satin-lipstick/550YSL.html' },
  { id: 7, brand: 'Pat McGrath Labs', productName: 'MatteTrance Lipstick in Elson', hex: '#B8242A', finish: 'Matte', buyLink: 'https://www.patmcgrath.com/products/mattetrance-lipstick?variant=40649033351239' },
  { id: 8, brand: 'Rare Beauty', productName: 'Lip Soufflé Matte Lip Cream in Inspire', hex: '#D04A4A', finish: 'Matte', buyLink: 'https://www.rarebeauty.com/products/lip-souffle-matte-lip-cream?variant=39620601938055' },
  { id: 9, brand: 'Clinique', productName: 'Almost Lipstick in Black Honey', hex: '#5B3439', finish: 'Glossy', buyLink: 'https://www.clinique.com/product/1605/7897/makeup/lipsticks/almost-lipstick' },
  { id: 10, brand: 'Glossier', productName: 'Generation G in Zip', hex: '#E5594F', finish: 'Matte', buyLink: 'https://www.glossier.com/products/generation-g' },
];


// Helper function to calculate color difference (CIE76 algorithm)
// This is a simplified version for demonstration purposes.
function getColorDifference(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return Infinity;

  // Using simple Euclidean distance for RGB values
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;

  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Finds the most similar lipstick products from the database based on a hex color.
 * @param targetHex The hex color to match against.
 * @returns An array of the top 3 similar lipstick products.
 */
export async function findSimilarLipsticks(targetHex: string): Promise<LipstickProduct[]> {
  if (!targetHex) return [];

  const productsWithDifference = lipstickDatabase.map(product => ({
    ...product,
    difference: getColorDifference(targetHex, product.hex),
  }));

  // Sort by color difference (ascending)
  productsWithDifference.sort((a, b) => a.difference - b.difference);
  
  // Return the top 3 matches
  return productsWithDifference.slice(0, 3);
}
