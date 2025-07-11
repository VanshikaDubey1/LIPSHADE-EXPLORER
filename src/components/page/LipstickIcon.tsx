import { cn } from "@/lib/utils";

type LipstickIconProps = {
  className?: string;
};

export default function LipstickIcon({ className }: LipstickIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      <path
        d="M8.5 18H15.5C16.8807 18 18 16.8807 18 15.5V10.5C18 9.11929 16.8807 8 15.5 8H8.5C7.11929 8 6 9.11929 6 10.5V15.5C6 16.8807 7.11929 18 8.5 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8V6.5C15 5.11929 13.8807 4 12.5 4H11.5C10.1193 4 9 5.11929 9 6.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
