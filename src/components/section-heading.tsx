import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeIn
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8",
        className
      )}
    >
      <div>
        {eyebrow && (
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </FadeIn>
  );
}
