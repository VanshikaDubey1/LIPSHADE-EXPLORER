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
import CameraView from '@/components/page/CameraView';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

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
  
  const handleCapture = (file: File) => {
    setIsCameraOpen(false);
    handleUpload(file);
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
              <ImageUploader 
                onUpload={handleUpload} 
                isLoading={isLoading}
                onUseCamera={() => setIsCameraOpen(true)}
              />
            )}
          </div>
        </div>

        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogContent className="max-w-3xl p-0 border-0">
             <CameraView onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />
          </DialogContent>
        </Dialog>

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
