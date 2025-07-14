import Image from 'next/image';
import LipstickIcon from '@/components/page/LipstickIcon';

type LoadingSpinnerProps = {
  preview: string | null;
};

export default function LoadingSpinner({ preview }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
      {preview && (
        <div className="mb-8 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
          <Image
            src={preview}
            alt="Uploading shade"
            width={200}
            height={200}
            className="object-cover w-full h-full"
            data-ai-hint="lipstick swatch"
          />
        </div>
      )}
      <div className="relative h-20 w-20">
         <LipstickIcon className="h-full w-full text-primary animate-spin" style={{ animationDuration: '1.5s' }} />
         <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
      </div>
      <h2 className="mt-6 font-headline text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl text-accent">
        Finding Your Match...
      </h2>
      <p className="mt-2 text-md md:text-lg text-muted-foreground">
        Our AI is analyzing the shade. This will only take a moment.
      </p>
    </div>
  );
}
