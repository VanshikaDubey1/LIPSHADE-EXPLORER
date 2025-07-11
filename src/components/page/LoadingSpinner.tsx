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
      <div className="relative">
         <LipstickIcon className="h-20 w-20 text-primary animate-spin" />
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-primary">
        Finding your match...
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Our AI is analyzing the shade. This will only take a moment.
      </p>
    </div>
  );
}
