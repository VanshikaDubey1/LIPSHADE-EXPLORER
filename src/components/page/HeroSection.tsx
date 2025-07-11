'use client';

import LipstickIcon from '@/components/page/LipstickIcon';
import ImageUploader from '@/components/page/ImageUploader';
import TypewriterTitle from '@/components/page/TypewriterTitle';

type HeroSectionProps = {
  onUpload: (file: File) => void;
  onCameraClick: () => void;
};

export default function HeroSection({ onUpload, onCameraClick }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden gradient-bg">
       <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
       <div className="container mx-auto px-4 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <LipstickIcon className="h-20 w-20 text-primary animate-pulse" style={{ animationDuration: '3s' }}/>
          </div>
          <TypewriterTitle />
          <p className="mt-6 max-w-2xl text-lg text-foreground/80 font-body">
            Snap a pic, find your shade. It&apos;s that simple. Our AI analyzes any photo to find your perfect lipstick match from top brands.
          </p>
          <div className="mt-10 w-full max-w-lg">
             <ImageUploader onUpload={onUpload} onCameraClick={onCameraClick} isLoading={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
