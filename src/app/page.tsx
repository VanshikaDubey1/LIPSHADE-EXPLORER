'use client';

import { useState, useRef, useEffect } from 'react';
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
import { UploadCloud } from 'lucide-react';

import Header from '@/components/page/Header';
import Footer from '@/components/page/Footer';
import HeroSection from '@/components/page/HeroSection';
import LoadingSpinner from '@/components/page/LoadingSpinner';
import ResultCard from '@/components/page/ResultCard';
import CameraView from '@/components/page/CameraView';
import VirtualTryOn from '@/components/page/VirtualTryOn';
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
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(true);
  const { toast } = useToast();
  
  const uploaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky button when the uploader is in view
        setShowStickyButton(!entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (uploaderRef.current) {
      observer.observe(uploaderRef.current);
    }

    return () => {
      if (uploaderRef.current) {
        observer.unobserve(uploaderRef.current);
      }
    };
  }, []);
  
  const scrollToUploader = () => {
    uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


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
    // After reset, scroll back to the uploader
    setTimeout(() => {
      uploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div ref={uploaderRef}>
          <HeroSection onUpload={handleUpload} onCameraClick={() => setIsCameraOpen(true)} onTryOnCLick={() => setIsTryOnOpen(true)} />
        </div>
        
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogContent className="max-w-3xl p-0 border-0">
             <DialogHeader className="sr-only">
                <DialogTitle>Camera View</DialogTitle>
             </DialogHeader>
             <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isTryOnOpen} onOpenChange={setIsTryOnOpen}>
          <DialogContent className="max-w-5xl p-0 border-0">
             <DialogHeader className="sr-only">
                <DialogTitle>Virtual Try-On</DialogTitle>
             </DialogHeader>
             <VirtualTryOn onCancel={() => setIsTryOnOpen(false)} />
          </DialogContent>
        </Dialog>


        <div ref={resultRef} className="py-16 md:py-24 transition-all duration-500 container mx-auto px-4 min-h-[50vh]">
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">Find your perfect shade in three simple steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12">
              <Card className="bg-background/80 border-border/50 text-center shadow-lg p-4 md:p-6">
                <CardHeader className="p-0">
                  <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">1</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-6">Upload Your Photo</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">Snap a selfie or upload a photo of lips wearing a shade you love.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 border-border/50 text-center shadow-lg p-4 md:p-6">
                <CardHeader className="p-0">
                   <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">2</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-6">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">Our smart AI detects the exact hex code of the lipstick shade.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 border-border/50 text-center shadow-lg p-4 md:p-6">
                <CardHeader className="p-0">
                   <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                     <span className="font-headline text-2xl font-bold">3</span>
                  </div>
                  <CardTitle className="font-headline text-xl mt-6">Get Your Match</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">Discover the closest product match from top brands and shop instantly.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Sticky Button for Mobile */}
      {showStickyButton && !result && (
        <div className="md:hidden fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <Button
              size="lg"
              className="rounded-full shadow-lg glow-on-hover h-14 px-6"
              onClick={scrollToUploader}
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Upload Now
            </Button>
        </div>
      )}
    </div>
  );
}
