import Image from "next/image";
import { cn } from "@/lib/utils";

export function ShweLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/shwe-logo.png"
      alt="Shwe Family"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
