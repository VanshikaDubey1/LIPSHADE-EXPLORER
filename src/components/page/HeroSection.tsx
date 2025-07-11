'use client';

import { Button } from '@/components/ui/button';
import LipstickIcon from '@/components/page/LipstickIcon';
import ImageUploader from '@/components/page/ImageUploader';

type HeroSectionProps = {
  onUpload: (file: File) => void;
  onCameraClick: () => void;
};

export default function HeroSection({ onUpload, onCameraClick }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden gradient-bg">
       <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
       <div className="container mx-auto px-4 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <LipstickIcon className="h-20 w-20 text-primary mb-6" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-2xl">
            Discover your perfect lipstick shade
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/80">
            Snap a pic, find your shade. It&apos;s that simple. Our AI analyzes any photo to find your perfect lipstick match from top brands.
          </p>
          <div className="mt-10 w-full max-w-md">
             <ImageUploader onUpload={onUpload} onCameraClick={onCameraClick} isLoading={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
