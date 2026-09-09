import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50 sm:mb-4 sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-white/60 sm:mt-6 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
