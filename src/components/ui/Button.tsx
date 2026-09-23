import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: ReactNode;
  /** Solid orange for the main action, outlined blue for everything alongside it. */
  variant?: "primary" | "secondary";
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-brand-orange to-brand-orange-soft text-white shadow-[0_10px_24px_-12px_rgba(249,122,31,0.85)] hover:from-brand-blue hover:to-brand-blue hover:shadow-[0_10px_24px_-12px_rgba(37,99,201,0.7)]",
  secondary: "border border-line bg-surface text-brand-blue hover:border-brand-blue",
};

/** Pill button with a trailing arrow. */
export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
        <path d="M6.5 1.5 11 6l-4.5 4.5V7.4H1V4.6h5.5z" />
      </svg>
    </Link>
  );
}
