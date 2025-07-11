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
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">We Found Your Match!</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Based on your image, here's the lipstick we recommend.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden shadow-xl shadow-black/20 w-full border-border/60 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-2xl">Your Image & Color</CardTitle>
            <CardDescription>The shade we detected from your upload.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {imagePreview && (
              <div className="w-full aspect-square rounded-lg overflow-hidden border-4 border-background shadow-md">
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
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 w-full">
                <div 
                  className="w-16 h-16 rounded-full border-4 border-background shadow-inner" 
                  style={{ backgroundColor: detectedColor }}
                  aria-label={`Detected color: ${detectedColor}`}
                ></div>
                <div className="text-left">
                  <p className="font-semibold text-lg text-foreground">Detected Shade</p>
                  <p className="font-mono text-muted-foreground uppercase">{detectedColor}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-xl shadow-black/20 w-full border-border/60 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-2xl">{match.productName}</CardTitle>
            <CardDescription>By {match.brand}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-muted-foreground">Finish:</span>
                <span className="font-bold text-foreground capitalize">{match.finish}</span>
              </div>
              <div 
                  className="w-full h-24 rounded-lg border-4 border-background shadow-inner" 
                  style={{ backgroundColor: detectedColor }}
                ></div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3 pt-6">
            <Button asChild size="lg">
              <Link href={match.buyLink} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onReset}>
              <RefreshCw className="mr-2 h-5 w-5" /> Try Another Shade
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
