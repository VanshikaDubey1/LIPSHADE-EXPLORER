import { cn } from "@/lib/utils";

type LipstickIconProps = {
  className?: string;
};

export default function LipstickIcon({ className }: LipstickIconProps) {
  return (
     <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10", className)}
    >
      <g clipPath="url(#clip0_105_239)">
        <path d="M7 6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V11H7V6Z" fill="currentColor" fillOpacity="0.5"/>
        <path d="M7 11H17V15H7V11Z" fill="currentColor"/>
        <path d="M5 20V15H19V20H5Z" fill="currentColor" fillOpacity="0.7"/>
        <path d="M9 4L7 6H17L15 4H9Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_105_239">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}