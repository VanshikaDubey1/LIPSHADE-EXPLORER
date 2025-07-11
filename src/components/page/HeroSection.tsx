import { Button } from '@/components/ui/button';
import LipstickIcon from '@/components/page/LipstickIcon';
import ImageUploader from '@/components/page/ImageUploader';

type HeroSectionProps = {
  onUpload: (file: File) => void;
};

export default function HeroSection({ onUpload }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <LipstickIcon className="h-20 w-20 text-primary mb-6" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-2xl">
            Discover your perfect lipstick shade
          </h1>
          <div className="mt-10 w-full max-w-md">
             <ImageUploader onUpload={onUpload} />
          </div>
        </div>
      </div>
    </section>
  );
}
