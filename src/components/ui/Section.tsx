import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  /** Light blue band, so consecutive sections separate without a rule. */
  muted?: boolean;
  className?: string;
  children: ReactNode;
}

/** Standard page band: vertical rhythm plus the site container. */
export function Section({ id, muted = false, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", muted && "bg-band", className)}>
      <div className="container-site">{children}</div>
    </section>
  );
}
