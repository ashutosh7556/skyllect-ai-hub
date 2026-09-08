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
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-lg leading-relaxed text-white/60">{description}</p>
      ) : null}
    </div>
  );
}
