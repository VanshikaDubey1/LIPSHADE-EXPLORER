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
          <div className="flex justify-center mb-6">
            <LipstickIcon />
          </div>
          <TypewriterTitle />
          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-foreground/70">
            Snap or upload a photo of any lipstick shade to instantly discover your perfect product match.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              className="glow-on-hover text-base font-bold tracking-wide uppercase px-10 py-7 rounded-full shadow-lg shadow-primary/20"
              onClick={onGetStarted}
            >
              Find Your Match
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
