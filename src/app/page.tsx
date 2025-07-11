'use client';

import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';
import { getShadeMatch } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import Header from '@/components/page/Header';
import Footer from '@/components/page/Footer';
import HeroSection from '@/components/page/HeroSection';
import LoadingSpinner from '@/components/page/LoadingSpinner';
import ResultCard from '@/components/page/ResultCard';
import CameraView from '@/components/page/CameraView';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ResultState = {
  detectedColor: string;
  match: MatchLipstickShadeOutput;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);

  const processFile = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
       toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please upload an image smaller than 4MB.",
      });
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setIsLoading(true);
    setResult(null);

    // Scroll to results area
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await getShadeMatch(formData);
      if (res.error) {
        throw new Error(res.error);
      }
      setResult(res);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error.message || "Failed to find a lipstick match. Please try another image.",
      });
      setResult(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleUpload = (file: File) => {
    processFile(file);
  };

  const handleCapture = (file: File) => {
    setIsCameraOpen(false);
    processFile(file);
  };

  const handleReset = () => {
    setResult(null);
    setImagePreview(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection onUpload={handleUpload} onCameraClick={() => setIsCameraOpen(true)} />
        
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogContent className="max-w-3xl p-0 border-0">
             <DialogHeader className="sr-only">
                <DialogTitle>Camera View</DialogTitle>
             </DialogHeader>
             <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
          </DialogContent>
        </Dialog>

        <div ref={resultRef} className="py-16 md:py-24 transition-all duration-500 container mx-auto px-4">
            {isLoading && <LoadingSpinner preview={imagePreview} />}
            {result && (
              <ResultCard 
                result={result} 
                imagePreview={imagePreview} 
                onReset={handleReset} 
              />
            )}
        </div>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-3xl font-bold text-accent">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">Find your perfect shade in three simple steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="bg-background/80 border-border/50 text-center shadow-lg">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">1</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-4">Upload Your Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Snap a selfie or upload a photo of lips wearing a shade you love.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 border-border/50 text-center shadow-lg">
                <CardHeader>
                   <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">2</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-4">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our smart AI detects the exact hex code of the lipstick shade.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 border-border/50 text-center shadow-lg">
                <CardHeader>
                   <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">3</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-4">Get Your Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discover the closest product match from top brands and shop instantly.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
