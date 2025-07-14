'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from 'lucide-react';
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';

type ResultCardProps = {
  result: {
    detectedColor: string;
    match: MatchLipstickShadeOutput;
  };
  imagePreview: string | null;
  onReset: () => void;
};

export default function ResultCard({ result, imagePreview, onReset }: ResultCardProps) {
  const { detectedColor, match } = result;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-16 duration-700 ease-out">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-accent">We Found Your Match!</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Based on your image, here's the lipstick we recommend.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="overflow-hidden shadow-xl shadow-primary/10 w-full border-primary/20 bg-background">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Image & Color</CardTitle>
            <CardDescription>The shade we detected from your upload.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {imagePreview && (
              <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
                 <Image 
                    src={imagePreview} 
                    alt="Uploaded lipstick shade" 
                    width={400} 
                    height={400} 
                    className="object-cover w-full h-full" 
                    data-ai-hint="lipstick swatch"
                  />
              </div>
            )}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/80 w-full">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-background/50 shadow-inner" 
                  style={{ backgroundColor: detectedColor }}
                  aria-label={`Detected color: ${detectedColor}`}
                ></div>
                <div className="text-left">
                  <p className="font-bold text-lg text-foreground">Detected Shade</p>
                  <p className="font-mono text-muted-foreground uppercase">{detectedColor}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-xl shadow-primary/10 w-full border-primary/20 bg-background md:sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{match.productName}</CardTitle>
            <CardDescription>By {match.brand}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-muted-foreground">Finish:</span>
                <span className="font-bold text-foreground capitalize">{match.finish}</span>
              </div>
              <div 
                  className="w-full h-24 rounded-lg border-2 border-background/50 shadow-inner" 
                  style={{ backgroundColor: detectedColor }}
                ></div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3 pt-6">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-on-hover">
              <Link href={match.buyLink} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onReset} className="transition-all hover:bg-primary/10">
              <RefreshCw className="mr-2 h-5 w-5" /> Try Another Shade
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
