"use client";

import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/utils";

const EMOJI_RE = /^\p{Extended_Pictographic}/u;

export function GameImage({ value, className }: { value: string; className?: string }) {
  const url = resolveImageUrl(value);
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={cn("object-cover", className)} />;
  }
  if (!EMOJI_RE.test(value)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={cn("object-cover", className)} />;
  }
  return <span className={className}>{value}</span>;
}