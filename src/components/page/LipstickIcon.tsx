import { cn } from "@/lib/utils";
import Image from "next/image";

type LipstickIconProps = {
  className?: string;
};

export default function LipstickIcon({ className }: LipstickIconProps) {
  return (
    <div className={cn("relative", className)}>
       <Image 
        src="https://placehold.co/100x100.png"
        alt="Lipstick Icon"
        width={100}
        height={100}
        className="object-contain"
        data-ai-hint="lipstick"
      />
    </div>
  );
}
