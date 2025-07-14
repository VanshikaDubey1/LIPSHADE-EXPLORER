'use client';

import LipstickIcon from '@/components/page/LipstickIcon';
import ImageUploader from '@/components/page/ImageUploader';
import TypewriterTitle from '@/components/page/TypewriterTitle';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';


type HeroSectionProps = {
  onUpload: (file: File) => void;
  onCameraClick: () => void;
  onTryOnCLick: () => void;
};

export default function HeroSection({ onUpload, onCameraClick, onTryOnCLick }: HeroSectionProps) {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden gradient-bg">
       <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
       <div className="container mx-auto px-4 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <LipstickIcon className="h-20 w-20 text-primary animate-pulse" style={{ animationDuration: '3s' }}/>
          </div>
          <TypewriterTitle />
          <p className="mt-4 max-w-2xl text-md md:text-lg text-foreground/80 font-body">
            Snap a pic to find your perfect lipstick match, or try on shades live with our new virtual try-on!
          </p>
          <div className="mt-10 w-full max-w-2xl">
            <div className="p-8 bg-background/30 backdrop-blur-md rounded-2xl shadow-lg">
               <ImageUploader onUpload={onUpload} onCameraClick={onCameraClick} isLoading={false} />
            </div>
             <div className="mt-6">
                <Button size="lg" className="w-full sm:w-auto glow-on-hover bg-accent text-accent-foreground hover:bg-accent/90" onClick={onTryOnCLick}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Live Virtual Try-On
                </Button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
