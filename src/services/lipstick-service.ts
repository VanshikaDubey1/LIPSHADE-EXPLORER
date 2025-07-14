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

// Mock database of lipstick products - Indian Brands
const lipstickDatabase: LipstickProduct[] = [
  // Lakmé
  { id: 1, brand: 'Lakmé', productName: '9 to 5 Primer + Matte Lip Color in Red Coat', hex: '#BD3339', finish: 'Matte', buyLink: 'https://www.nykaa.com/lakme-9-to-5-primer-matte-lip-color/p/79619' },
  { id: 2, brand: 'Lakmé', productName: 'Absolute Matte Melt Liquid Lip Color in Mild Mauve', hex: '#B98182', finish: 'Liquid', buyLink: 'https://www.nykaa.com/lakme-absolute-matte-melt-liquid-lip-color/p/249141' },
  { id: 3, brand: 'Lakmé', productName: 'Enrich Lip Crayon in Peach Magnet', hex: '#E29E87', finish: 'Creme', buyLink: 'https://www.nykaa.com/lakme-enrich-lip-crayon/p/258417' },
  { id: 4, brand: 'Lakmé', productName: 'Cushion Matte Lipstick in Pink Blush', hex: '#D48A96', finish: 'Matte', buyLink: 'https://www.nykaa.com/lakme-cushion-matte-lipstick/p/659695' },
  { id: 5, brand: 'Lakmé', productName: '9 to 5 Weightless Matte Mousse Lip & Cheek Color in Blush Velvet', hex: '#D08A8F', finish: 'Matte', buyLink: 'https://www.nykaa.com/lakme-9-to-5-weightless-matte-mousse-lip-cheek-color/p/79599' },
  { id: 446, brand: 'Lakmé', productName: 'Absolute Matte Melt Liquid Lip Color in Wine N Dine', hex: '#8C4A58', finish: 'Liquid', buyLink: 'https://www.lakmeindia.com/products/lakme-absolute-matte-melt-liquid-lip-color-wine-n-dine' },
  { id: 447, brand: 'Lakmé', productName: '9 to 5 Primer + Matte Lip Color in Rosy Sunday', hex: '#D17C7E', finish: 'Matte', buyLink: 'https://www.lakmeindia.com/products/lakme-9-to-5-primer-matte-lip-color-rosy-sunday' },
  { id: 448, brand: 'Lakmé', productName: 'Enrich Lip Crayon in Berry Red', hex: '#C04C5A', finish: 'Creme', buyLink: 'https://www.lakmeindia.com/products/lakme-enrich-lip-crayon-berry-red' },
  { id: 449, brand: 'Lakmé', productName: 'Absolute Spotlight Lip Gloss in Berry Heaven', hex: '#C07080', finish: 'Glossy', buyLink: 'https://www.lakmeindia.com/products/lakme-absolute-spotlight-lip-gloss-berry-heaven' },
  { id: 450, brand: 'Lakmé', productName: 'Cushion Matte Lipstick in Wine Touch', hex: '#A35A6D', finish: 'Matte', buyLink: 'https://www.lakmeindia.com/products/lakme-cushion-matte-lipstick-wine-touch' },

  // Sugar Cosmetics
  { id: 6, brand: 'Sugar Cosmetics', productName: 'Matte As Hell Crayon Lipstick in 01 Scarlett O\'Hara', hex: '#C5292D', finish: 'Matte', buyLink: 'https://in.sugarcosmetics.com/products/matte-as-hell-crayon-lipstick-01-scarlett-o-hara' },
  { id: 7, brand: 'Sugar Cosmetics', productName: 'Smudge Me Not Liquid Lipstick in 02 Brink of Pink', hex: '#CF6B8A', finish: 'Liquid', buyLink: 'https://in.sugarcosmetics.com/products/smudge-me-not-liquid-lipstick-02-brink-of-pink' },
  { id: 8, brand: 'Sugar Cosmetics', productName: 'Nothing Else Matter Longwear Lipstick in 15 Peach Bunny', hex: '#D7907C', finish: 'Matte', buyLink: 'https://in.sugarcosmetics.com/products/nothing-else-matter-longwear-lipstick-15-peach-bunny' },
  { id: 9, brand: 'Sugar Cosmetics', productName: 'Mettle Satin Lipstick in 01 Sophie (Bright Fuchsia)', hex: '#D94B8A', finish: 'Satin', buyLink: 'https://in.sugarcosmetics.com/products/mettle-satin-lipstick-01-sophie' },
  { id: 10, brand: 'Sugar Cosmetics', productName: 'Matte Attack Transferproof Lipstick in 02 Red Zeppelin', hex: '#B0292E', finish: 'Matte', buyLink: 'https://in.sugarcosmetics.com/products/matte-attack-transferproof-lipstick-02-red-zeppelin' },
  { id: 436, brand: 'Sugar Cosmetics', productName: 'Smudge Me Not Liquid Lipstick in 10 Drop Dead Red', hex: '#A9242F', finish: 'Liquid', buyLink: 'https://in.sugarcosmetics.com/products/smudge-me-not-liquid-lipstick-10-drop-dead-red' },
  { id: 437, brand: 'Sugar Cosmetics', productName: 'Matte As Hell Crayon Lipstick in 07 Viola', hex: '#B5637E', finish: 'Matte', buyLink: 'https://in.sugarcosmetics.com/products/matte-as-hell-crayon-lipstick-07-viola' },
  { id: 438, brand: 'Sugar Cosmetics', productName: 'Nothing Else Matter Longwear Lipstick in 01 Rose Job', hex: '#C08181', finish: 'Matte', buyLink: 'https://in.sugarcosmetics.com/products/nothing-else-matter-longwear-lipstick-01-rose-job' },
  { id: 439, brand: 'Sugar Cosmetics', productName: 'Time To Shine Lip Gloss in 02 Velma Pinkley', hex: '#E4A0AF', finish: 'Glossy', buyLink: 'https://in.sugarcosmetics.com/products/time-to-shine-lip-gloss-02-velma-pinkley' },
  { id: 440, brand: 'Sugar Cosmetics', productName: 'Mettle Satin Lipstick in 05 Helena', hex: '#A04D4A', finish: 'Satin', buyLink: 'https://in.sugarcosmetics.com/products/mettle-satin-lipstick-05-helena' },

  // Kay Beauty
  { id: 11, brand: 'Kay Beauty', productName: 'Matte Lipstick in Snapshot', hex: '#B66F63', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matte-lipstick/p/681755?skuId=681744' },
  { id: 12, brand: 'Kay Beauty', productName: 'Creme Lipstick in Red Carpet', hex: '#C23E3E', finish: 'Creme', buyLink: 'https://www.nykaa.com/kay-beauty-creme-lipstick/p/1109038?skuId=1109028' },
  { id: 13, brand: 'Kay Beauty', productName: 'Lip Crayon in Rom-Com', hex: '#CE8B80', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matte-action-lip-crayon/p/681788?skuId=681781' },
  { id: 14, brand: 'Kay Beauty', productName: 'Matteinee Lipstick in On-Screen', hex: '#B87A71', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matteinee-lipstick/p/1109062?skuId=1109050' },
  { id: 15, brand: 'Kay Beauty', productName: 'Matte Drama Lipstick in Muse', hex: '#A85A59', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matte-drama-lipstick/p/2670004?skuId=2669994' },
  { id: 441, brand: 'Kay Beauty', productName: 'Matte Lipstick in Feature', hex: '#C67A6C', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matte-lipstick-feature/p/681755' },
  { id: 442, brand: 'Kay Beauty', productName: 'Creme Lipstick in Premiere', hex: '#CF857A', finish: 'Creme', buyLink: 'https://www.nykaa.com/kay-beauty-creme-lipstick-premiere/p/1109038' },
  { id: 443, brand: 'Kay Beauty', productName: 'Lip Crayon in Blockbuster', hex: '#A14E50', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matte-action-lip-crayon-blockbuster/p/681788' },
  { id: 444, brand: 'Kay Beauty', productName: 'Gloss in Paparazzi', hex: '#D9AFAC', finish: 'Glossy', buyLink: 'https://www.nykaa.com/kay-beauty-lip-gloss-paparazzi/p/1109074' },
  { id: 445, brand: 'Kay Beauty', productName: 'Matteinee Lipstick in Climax', hex: '#874D4F', finish: 'Matte', buyLink: 'https://www.nykaa.com/kay-beauty-matteinee-lipstick-climax/p/1109062' },

  // MyGlamm
  { id: 16, brand: 'MyGlamm', productName: 'LIT Liquid Matte Lipstick in Swinger', hex: '#D35757', finish: 'Liquid', buyLink: 'https://www.myglamm.com/product/lit-liquid-matte-lipstick-swinger.html' },
  { id: 17, brand: 'MyGlamm', productName: 'Ultimatte Long-Stay Matte Lipstick in Showgirl', hex: '#B8536A', finish: 'Matte', buyLink: 'https://www.myglamm.com/product/ultimatte-long-stay-matte-lipstick-showgirl.html' },
  { id: 18, brand: 'MyGlamm', productName: 'Pose HD Lipstick in True Red', hex: '#C73434', finish: 'Satin', buyLink: 'https://www.myglamm.com/product/myglamm-pose-hd-lipstick-true-red.html' },
  { id: 19, brand: 'MyGlamm', productName: 'K.Play Flavoured Lipstick in Pink Guava Smash', hex: '#D87A8A', finish: 'Creme', buyLink: 'https://www.myglamm.com/product/k-play-flavoured-lipstick-pink-guava-smash.html' },
  { id: 20, brand: 'MyGlamm', productName: 'Perfect Curves Matte Lip Crayon in Terra', hex: '#B07563', finish: 'Matte', buyLink: 'https://www.myglamm.com/product/perfect-curves-matte-lip-crayon-terra-brown.html' },

  // Nykaa Cosmetics
  { id: 21, brand: 'Nykaa Cosmetics', productName: 'Matte To Last! Liquid Lipstick in Maharani', hex: '#9E2B2F', finish: 'Liquid', buyLink: 'https://www.nykaa.com/nykaa-matte-to-last-liquid-lipstick/p/242250' },
  { id: 22, brand: 'Nykaa Cosmetics', productName: 'So Creme! Creamy Matte Lipstick in On Fire', hex: '#C64141', finish: 'Matte', buyLink: 'https://www.nykaa.com/nykaa-so-creme-creamy-matte-lipstick/p/447271' },
  { id: 23, brand: 'Nykaa Cosmetics', productName: 'Paintstix! Lipstick in No Chill', hex: '#DB7D73', finish: 'Satin', buyLink: 'https://www.nykaa.com/nykaa-paintstix-lipstick/p/109277' },
  { id: 24, brand: 'Nykaa Cosmetics', productName: 'Ultra Matte Lipstick in Cleopatra', hex: '#7D3B3F', finish: 'Matte', buyLink: 'https://www.nykaa.com/nykaa-ultra-matte-lipstick/p/396323' },
  { id: 25, brand: 'Nykaa Cosmetics', productName: 'Gloss it Up! High Shine Lip Gloss in Sweet Angel', hex: '#E7B4B8', finish: 'Glossy', buyLink: 'https://www.nykaa.com/nykaa-gloss-it-up-high-shine-lip-gloss/p/533519' },

  // Colorbar
  { id: 26, brand: 'Colorbar', productName: 'Velvet Matte Lipstick in Bare', hex: '#D7A69A', finish: 'Matte', buyLink: 'https://www.nykaa.com/colorbar-velvet-matte-lipstick/p/2366' },
  { id: 27, brand: 'Colorbar', productName: 'Kiss Proof Lip Stain in Hollywood', hex: '#C23A3A', finish: 'Liquid', buyLink: 'https://www.nykaa.com/colorbar-kiss-proof-lip-stain/p/33139' },
  { id: 28, brand: 'Colorbar', productName: 'Sinful Matte Lipcolor in Envious', hex: '#B8587A', finish: 'Matte', buyLink: 'https://www.nykaa.com/colorbar-sinful-matte-lipcolor/p/272336' },
  { id: 29, brand: 'Colorbar', productName: 'USA Creme Me As I Am Lipcolor in Flirt', hex: '#D88184', finish: 'Creme', buyLink: 'https://www.nykaa.com/colorbar-creme-me-as-i-am-lipcolor/p/447817' },
  { id: 30, brand: 'Colorbar', productName: 'Definer Lip Liner in Rosy Red', hex: '#C9555C', finish: 'Matte', buyLink: 'https://www.nykaa.com/colorbar-definer-lip-liner/p/2347' },

  // Plum
  { id: 31, brand: 'Plum', productName: 'Matterrific Lipstick in Sink In Pink', hex: '#D17C92', finish: 'Matte', buyLink: 'https://www.nykaa.com/plum-matterrific-lipstick/p/489025' },
  { id: 32, brand: 'Plum', productName: 'Matte In Heaven Liquid Lipstick in Lychee-licious', hex: '#C68079', finish: 'Liquid', buyLink: 'https://www.nykaa.com/plum-matte-in-heaven-liquid-lipstick/p/1189914' },
  { id: 33, brand: 'Plum', productName: 'Candy Melts Vegan Lip Balm in Berry Feast', hex: '#B57080', finish: 'Glossy', buyLink: 'https://www.nykaa.com/plum-candy-melts-vegan-lip-balm/p/767170' },
  { id: 34, brand: 'Plum', productName: 'Matterrific Lipstick in Rosy Rhyme', hex: '#B96A7C', finish: 'Matte', buyLink: 'https://www.nykaa.com/plum-matterrific-lipstick/p/489025' },
  { id: 35, brand: 'Plum', productName: 'Matte In Heaven Liquid Lipstick in Cocoa-nut', hex: '#A3685C', finish: 'Liquid', buyLink: 'https://www.nykaa.com/plum-matte-in-heaven-liquid-lipstick/p/1189914' },
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
