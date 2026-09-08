import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "glass";
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-white text-black hover:bg-white/85",
  secondary: "border border-white/20 text-foreground hover:border-white/50",
  glass: "liquid-glass text-foreground hover:text-foreground",
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
