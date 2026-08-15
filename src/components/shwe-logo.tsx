import { cn } from "@/lib/utils";

export function ShweLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C518" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8960C" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#gold-grad)" />
      <path
        d="M68 30C68 30 62 26 54 26C44 26 38 32 38 38C38 44 42 48 50 50C58 52 64 56 64 64C64 72 58 78 48 78C40 78 34 74 34 74"
        stroke="white"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 30C32 30 38 26 46 26C56 26 62 32 62 38C62 44 58 48 50 50C42 52 36 56 36 64C36 72 42 78 52 78C60 78 66 74 66 74"
        stroke="white"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
