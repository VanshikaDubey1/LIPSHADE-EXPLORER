import { Button } from '@/components/ui/button';
import LipstickIcon from '@/components/page/LipstickIcon';
import TypewriterTitle from '@/components/page/TypewriterTitle';

type HeroSectionProps = {
  onGetStarted: () => void;
};

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden gradient-bg">
      <div className="container mx-auto px-4 text-center">
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <LipstickIcon />
          </div>
          <TypewriterTitle />
          <p className="max-w-2xl mx-auto mt-4 text-base md:text-lg text-foreground/70">
            Upload or snap a photo of any lipstick shade to instantly find your perfect product match.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="glow-on-hover text-lg px-8 py-6 rounded-full font-bold"
              onClick={onGetStarted}
            >
              Upload Your Shade
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
