"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// How much of the section must be on screen before it counts as "in view".
const THRESHOLD = 0.12;

/**
 * Fades its section in with Animate.css as it enters the viewport and back
 * out as it leaves, in either scroll direction. Until the observer reports,
 * nothing is applied, so content is never hidden if JavaScript fails.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: THRESHOLD },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        inView !== null && "animate__animated reveal",
        inView === true && "animate__fadeIn",
        inView === false && "animate__fadeOut",
      )}
    >
      {children}
    </div>
  );
}
