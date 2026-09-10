"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SOLUTIONS } from "@/data/solutions";

/**
 * The frame every AI solution shares: breadcrumb and container.
 *
 * This lives in `app/solutions/layout.tsx`, so it stays mounted when you move
 * between solutions — the chrome does not remount, and only the content
 * inside the template animates. Switching is done from the AI Solutions
 * dropdown in the header.
 */
export function SolutionsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <li>AI Solutions</li>
            <li aria-hidden="true">/</li>
            <li className="text-white/70">
              {SOLUTIONS.find((s) => pathname?.endsWith(s.slug))?.railLabel ?? "Overview"}
            </li>
          </ol>
        </nav>

        {children}
      </div>
    </div>
  );
}
