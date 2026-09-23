"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SOLUTIONS } from "@/data/solutions";
import { Breadcrumb } from "@/components/technology/SectionShell";

/**
 * The frame every AI solution shares: breadcrumb and container. Lives in
 * `app/solutions/layout.tsx`, so it stays mounted when you move between
 * solutions from the AI Solutions dropdown in the header.
 */
export function SolutionsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="py-10 sm:py-14">
      <div className="container-site">
        <Breadcrumb
          section="AI Solutions"
          current={SOLUTIONS.find((s) => pathname?.endsWith(s.slug))?.railLabel ?? "Overview"}
        />

        {children}
      </div>
    </div>
  );
}
