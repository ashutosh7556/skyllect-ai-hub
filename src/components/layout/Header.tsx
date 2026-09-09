"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS, PRIMARY_CTA } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link href="#home" className="flex items-center gap-2.5">
          <Logo variant="icon" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Skyllect
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/90 transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={PRIMARY_CTA.href}
          className="liquid-glass hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-foreground lg:inline-flex"
        >
          {PRIMARY_CTA.label}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {open ? (
        <div className="absolute inset-x-4 top-[64px] max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-background/95 p-5 backdrop-blur-md sm:top-[72px] sm:p-6 lg:hidden">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-base text-foreground/80 transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={PRIMARY_CTA.href}
              onClick={() => setOpen(false)}
              className="liquid-glass mt-3 rounded-full px-5 py-3.5 text-center text-sm font-medium text-foreground"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
