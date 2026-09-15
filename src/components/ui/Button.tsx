import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "glass";
  className?: string;
}

/*
 * Controls on a machine, not buttons on a marketing page. The primary is the
 * only lit one: a dark body with a cyan edge and a low glow behind it, so it
 * reads as the powered control rather than as a white pill dropped onto the
 * page. The other two are unlit housings.
 */
const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-accent/45 bg-accent/10 text-accent-soft shadow-[inset_0_1px_0_rgba(190,235,255,0.16),0_0_30px_-10px_rgba(92,200,232,0.65)] hover:border-accent/80 hover:bg-accent/18 hover:text-foreground",
  secondary:
    "border border-edge text-foreground/85 hover:border-edge-strong hover:text-foreground",
  glass: "liquid-glass text-foreground/85 hover:text-foreground",
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors duration-300",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
