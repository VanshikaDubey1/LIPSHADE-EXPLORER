'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { MatchLipstickShadeOutput } from '@/ai/flows/match-lipstick-shade';
import { getShadeMatch } from '@/app/actions';

import Header from '@/components/page/Header';
import Footer from '@/components/page/Footer';
import HeroSection from '@/components/page/HeroSection';
import ImageUploader from '@/components/page/ImageUploader';
import ResultCard from '@/components/page/ResultCard';
import LoadingSpinner from '@/components/page/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

type ResultState = {
  detectedColor: string;
  match: MatchLipstickShadeOutput;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prefetch server action module
    getShadeMatch(new FormData());
  }, []);

  const handleGetStarted = () => {
    uploadRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setIsLoading(true);
    setResult(null);

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
  };

  const handleReset = () => {
    setResult(null);
    setImagePreview(null);
    setIsLoading(false);
    
    // Smooth scroll back to the uploader
    uploadRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {!result && !isLoading && <HeroSection onGetStarted={handleGetStarted} />}

        <div ref={uploadRef} className="py-16 md:py-24 transition-all duration-500" id="upload-section">
          <div className="container mx-auto px-4">
            {isLoading && <LoadingSpinner preview={imagePreview} />}
            {result && (
              <ResultCard 
                result={result} 
                imagePreview={imagePreview} 
                onReset={handleReset} 
              />
            )}
            {!isLoading && !result && (
              <ImageUploader onUpload={handleUpload} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Button
        onClick={handleGetStarted}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full shadow-2xl glow-on-hover z-50"
        aria-label="Upload Shade"
      >
        <Upload className="h-6 w-6" />
      </Button>
    </div>
  );
}
